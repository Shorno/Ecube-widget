"use client";

import { useRef } from "react";
import { useWidgetReady } from "@/hooks/useWidgetReady";

// Wraps widget content and keeps it invisible until all <img> tags in the
// subtree have fully loaded. Prevents progressive-JPEG chunk flashing in OBS.
//
// Usage:
//   <WidgetStage dataReady={!!data}>
//     {/* existing JSX unchanged */}
//   </WidgetStage>
//
// Future animations: add entry animation logic where opacity-100 is applied.
export default function WidgetStage({ dataReady, children }) {
  const ref = useRef(null);
  const ready = useWidgetReady(ref, dataReady);

  return (
    <div
      ref={ref}
      // transition-opacity duration-500
      className={`${ready ? "opacity-100" : "opacity-0"}`}
    >
      {children}
    </div>
  );
}
