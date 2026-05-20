"use client";

import { useRef, useEffect } from "react";
import { useWidgetReady } from "@/hooks/useWidgetReady";

// Wraps widget content and keeps it invisible until all <img> tags in the
// subtree have fully loaded. Prevents progressive-JPEG chunk flashing in OBS.
//
// onReady fires once when the stage becomes visible — use it to start GSAP
// animations so they never run while the container is still opacity-0.
export default function WidgetStage({ dataReady, children, onReady }) {
  const ref = useRef(null);
  const ready = useWidgetReady(ref, dataReady);

  // Keep a ref to onReady so the effect below never needs it as a dependency.
  // This is safe because onReady should only fire once (when ready flips true).
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  });

  // Fire onReady exactly once when ready flips true
  useEffect(() => {
    if (ready) onReadyRef.current?.();
  }, [ready]);

  return (
    <div ref={ref} className={ready ? "opacity-100" : "opacity-0"}>
      {children}
    </div>
  );
}
