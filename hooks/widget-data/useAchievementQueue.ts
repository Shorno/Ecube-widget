"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AchievementQueueItem } from "@/types/achievement-event";

const HOLD_MS = 4500;

export function useAchievementQueue() {
  const [currentEvent, setCurrentEvent] = useState<AchievementQueueItem | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const queueRef = useRef<AchievementQueueItem[]>([]);
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
    setCurrentEvent(next);
    setIsVisible(true);

    holdTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HOLD_MS);
  }, [clearTimers]);

  const enqueue = useCallback(
    (item: AchievementQueueItem) => {
      queueRef.current.push(item);
      processNext();
    },
    [processNext],
  );

  const onExitComplete = useCallback(() => {
    setCurrentEvent(null);
    playingRef.current = false;
    processNext();
  }, [processNext]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    currentEvent,
    isVisible,
    isLocked,
    enqueue,
    onExitComplete,
  };
}
