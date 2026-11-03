"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TeamRecallPayload } from "@/types/team-recall";
import { RECALL_PREVIEW_SCENARIOS } from "./mockTeamRecall";

const HOLD_MS = 5000;

type Options = { preview?: boolean };

/**
 * Same play-one-at-a-time queue as team elimination, plus in-place updates:
 * PCOB delivers a multi-player recall as several TEAM_RECALL events under one
 * id, so an event matching the card on screen replaces its data (the new
 * player slides in) and restarts the hold instead of queueing a second card.
 */
export function useRecallQueue({ preview = false }: Options = {}) {
  const [currentRecall, setCurrentRecall] = useState<TeamRecallPayload | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const queueRef = useRef<TeamRecallPayload[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const isVisibleRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const show = useCallback((visible: boolean) => {
    isVisibleRef.current = visible;
    setIsVisible(visible);
  }, []);

  const startHold = useCallback(() => {
    clearTimers();
    holdTimerRef.current = setTimeout(() => show(false), HOLD_MS);
  }, [clearTimers, show]);

  const processNext = useCallback(() => {
    if (currentIdRef.current) return;
    const next = queueRef.current.shift();
    if (!next) {
      setIsLocked(false);
      return;
    }

    currentIdRef.current = next.id;
    setIsLocked(true);
    setCurrentRecall(next);
    show(true);
    startHold();
  }, [show, startHold]);

  const enqueue = useCallback(
    (payload: TeamRecallPayload) => {
      if (currentIdRef.current === payload.id) {
        setCurrentRecall(payload);
        // A card already exiting stays on its way out; only a card still on
        // screen gets its hold extended for the new player.
        if (isVisibleRef.current) startHold();
        return;
      }

      const queuedIndex = queueRef.current.findIndex(
        (r) => r.id === payload.id,
      );
      if (queuedIndex >= 0) queueRef.current[queuedIndex] = payload;
      else queueRef.current.push(payload);
      processNext();
    },
    [processNext, startHold],
  );

  // Not gated on isLocked: firing a scenario while a card is up exercises the
  // queue exactly like back-to-back recalls in a real match.
  const triggerPreview = useCallback(
    (scenarioKey: string) => {
      if (!preview) return;
      const scenario = RECALL_PREVIEW_SCENARIOS.find(
        (s) => s.key === scenarioKey,
      );
      if (!scenario) return;
      const runId = `preview-${scenario.key}-${Date.now()}`;
      for (const step of scenario.steps(runId)) {
        previewTimersRef.current.push(
          setTimeout(() => enqueue(step.payload), step.at),
        );
      }
    },
    [preview, enqueue],
  );

  const reset = useCallback(() => {
    clearTimers();
    previewTimersRef.current.forEach(clearTimeout);
    previewTimersRef.current = [];
    queueRef.current = [];
    currentIdRef.current = null;
    setCurrentRecall(null);
    show(false);
    setIsLocked(false);
  }, [clearTimers, show]);

  const onExitComplete = useCallback(() => {
    setCurrentRecall(null);
    currentIdRef.current = null;
    processNext();
  }, [processNext]);

  useEffect(
    () => () => {
      clearTimers();
      previewTimersRef.current.forEach(clearTimeout);
    },
    [clearTimers],
  );

  return {
    currentRecall,
    isVisible,
    isLocked,
    triggerPreview,
    enqueue,
    reset,
    onExitComplete,
  };
}
