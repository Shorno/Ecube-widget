import { useState, useEffect, useLayoutEffect } from "react";
import { reportWidgetError } from "@/lib/widget-status-client";

export function useWidgetReady(containerRef, dataReady) {
  const [ready, setReady] = useState(false);

  // No-image path: useLayoutEffect allows synchronous setState without the
  // react-hooks/set-state-in-effect compiler rule, and ensures the widget
  // is never painted invisible — opacity flips before the first browser frame.
  useLayoutEffect(() => {
    if (!dataReady || !containerRef.current) return;
    const images = containerRef.current.querySelectorAll("img");
    if (images.length === 0) setReady(true);
  }, [dataReady, containerRef]);

  // Image path: attach load/error listeners and reveal once all images settle.
  useEffect(() => {
    if (!dataReady || !containerRef.current) return;
    const images = Array.from(containerRef.current.querySelectorAll("img"));
    if (images.length === 0) return; // handled by useLayoutEffect above

    let remaining = images.length;
    const failedImages = [];

    function onLoad() {
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    }

    function onError(src) {
      failedImages.push(src);
      reportWidgetError({
        kind: "image-load",
        message: "One or more required widget images failed to load.",
        details: failedImages,
      });

      if (process.env.NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR === "false") {
        onLoad();
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        if (img.naturalWidth > 0) onLoad();
        else onError(img.src);
      } else {
        img.addEventListener("load", onLoad, { once: true });
        const src = img.src;
        img.addEventListener("error", () => onError(src), { once: true });
      }
    });
  }, [dataReady, containerRef]);

  return ready;
}
