import { useState, useEffect } from "react";

export function useWidgetReady(containerRef, dataReady) {
  // `ready` drives WidgetStage visibility — false keeps the widget at opacity-0
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't scan until API data has arrived — img tags don't exist in the DOM yet
    if (!dataReady) return;

    // containerRef.current can be null on the very first render tick
    if (!containerRef.current) return;

    // Collect every <img> tag in the entire widget subtree, including deeply nested ones
    const images = Array.from(containerRef.current.querySelectorAll("img"));

    // No images in this widget — nothing to wait for, show immediately
    if (images.length === 0) {
      setReady(true);
      return;
    }

    // Tracks how many images are still pending — reaches 0 when all succeed
    let remaining = images.length;

    // Accumulates src values of any images that failed to load
    const failedImages = [];

    // Called each time an image finishes loading successfully
    function onLoad() {
      remaining -= 1;
      // All images loaded without error — safe to reveal the widget
      if (remaining <= 0) setReady(true);
    }

    // Called when an image fails — widget stays hidden, failure is reported
    function onError(src) {
      failedImages.push(src);

      // Fire-and-forget POST so the controller can display a warning.
      // We don't await this — a reporting failure must never affect the widget lifecycle.
      fetch("/api/widget-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The widget's own URL identifies which widget is broken
          widgetUrl: window.location.pathname,
          failedImages,
        }),
      }).catch(() => {
        // Silently ignore network errors — reporting is best-effort
      });

      // If NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR is "false", treat the failure like a
      // successful load so the widget still appears (with the broken image slot empty).
      // Default behaviour (any other value, or unset) keeps the widget hidden.
      if (process.env.NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR === "false") {
        onLoad();
      }
      // Otherwise do NOT decrement `remaining` or call setReady.
      // The counter stays above zero, ready never becomes true,
      // and the widget stays invisible on the broadcast output.
    }

    images.forEach((img) => {
      if (img.complete) {
        // `complete` is true both for a successful decode AND a failed load.
        // `naturalWidth === 0` distinguishes a failed load from a successful one.
        if (img.naturalWidth > 0) {
          // Already fully loaded (browser cache hit) — count it as done
          onLoad();
        } else {
          // Already failed (e.g. 404 resolved before this effect ran)
          onError(img.src);
        }
      } else {
        // Image is still in flight — attach one-time listeners.
        // `{ once: true }` means the browser removes the listener automatically after it fires,
        // so we never need to manually call removeEventListener.
        img.addEventListener("load", onLoad, { once: true });

        // Capture img.src now, because by the time the error fires the attribute might differ
        const src = img.src;
        img.addEventListener("error", () => onError(src), { once: true });
      }
    });

  // Only re-run this effect when `dataReady` changes (false → true).
  // Running on every render would attach duplicate listeners.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady]);

  return ready;
}
