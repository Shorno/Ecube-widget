"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TeamEliminationPayload } from "@/types/team-elimination";
import { getMockTeamElimination } from "./mockTeamElimination";

const HOLD_MS = 4500;

type Options = { preview?: boolean };

export function useTeamElimination(
  tournamentID: string,
  { preview = false }: Options = {},
) {
  const [currentElimination, setCurrentElimination] =
    useState<TeamEliminationPayload | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const queueRef = useRef<TeamEliminationPayload[]>([]);
  const playingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const processNext = useCallback(() => {
    if (playingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) {
      setIsLocked(false);
      return;
    }

    clearTimers();
    playingRef.current = true;
    setIsLocked(true);
    setCurrentElimination(next);
    setIsVisible(true);

    holdTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HOLD_MS);
  }, [clearTimers]);

  const enqueue = useCallback(
    (payload: TeamEliminationPayload) => {
      queueRef.current.push(payload);
      processNext();
    },
    [processNext],
  );

  const triggerPreview = useCallback(() => {
    if (!preview || isLocked) return;
    enqueue(getMockTeamElimination());
  }, [preview, isLocked, enqueue]);

  const onExitComplete = useCallback(() => {
    setCurrentElimination(null);
    playingRef.current = false;
    processNext();
  }, [processNext]);

  useEffect(() => {
    if (preview || !tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;

    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const ws = new WebSocket(`${wsBase}/tournament?id=${tournamentID}`);

    ws.onmessage = (event) => {
      let parsed: { event?: string; data?: unknown };
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }

      if (parsed.event === "TEAM_ELIMINATION" && parsed.data) {
        enqueue(parsed.data as TeamEliminationPayload);
      }
    };

    return () => {
      ws.close();
      clearTimers();
    };
  }, [tournamentID, preview, enqueue, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    currentElimination,
    isVisible,
    isLocked,
    triggerPreview,
    onExitComplete,
    preview,
  };
}
