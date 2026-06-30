"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 4500;

type Options = { preview?: boolean };

export function useMatchStartOverlay({ preview = false }: Options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimers();
    setShouldRender(true);
    setIsLocked(true);
    setIsVisible(true);

    holdTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HOLD_MS);
  }, [clearTimers]);

  const triggerPreview = useCallback(() => {
    if (!preview || isLocked) return;
    show();
  }, [preview, isLocked, show]);

  const armAutoShow = useCallback(() => {
    if (preview || hasAutoPlayedRef.current) return;
    hasAutoPlayedRef.current = true;
    show();
  }, [preview, show]);

  const onExitComplete = useCallback(() => {
    setShouldRender(false);
    setIsLocked(false);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    hasAutoPlayedRef.current = false;
    setShouldRender(false);
    setIsVisible(false);
    setIsLocked(false);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    isVisible,
    isLocked,
    shouldRender,
    show,
    triggerPreview,
    armAutoShow,
    onExitComplete,
    reset,
  };
}
