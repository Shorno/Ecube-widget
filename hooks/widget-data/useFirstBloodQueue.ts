"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FirstBloodPayload } from "@/types/first-blood";

const HOLD_MS = 4500;

type Options = {
  preview?: boolean;
  getMock?: () => FirstBloodPayload;
};

export function useFirstBloodQueue({ preview = false, getMock }: Options = {}) {
  const [currentFirstBlood, setCurrentFirstBlood] =
    useState<FirstBloodPayload | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const queueRef = useRef<FirstBloodPayload[]>([]);
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
    setCurrentFirstBlood(next);
    setIsVisible(true);

    holdTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HOLD_MS);
  }, [clearTimers]);

  const enqueue = useCallback(
    (payload: FirstBloodPayload) => {
      queueRef.current.push(payload);
      processNext();
    },
    [processNext],
  );

  const triggerPreview = useCallback(() => {
    if (!preview || isLocked || !getMock) return;
    enqueue(getMock());
  }, [preview, isLocked, enqueue, getMock]);

  const onExitComplete = useCallback(() => {
    setCurrentFirstBlood(null);
    playingRef.current = false;
    processNext();
  }, [processNext]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    currentFirstBlood,
    isVisible,
    isLocked,
    triggerPreview,
    enqueue,
    onExitComplete,
  };
}
