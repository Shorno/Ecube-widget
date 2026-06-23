"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  AFTER_MATCH_WIDGETS,
  IN_GAME_WIDGETS,
  getWidgetPath,
} from "@/lib/widget-catalog";

function buildPreloadUrls(userId, tournamentID) {
  return [...AFTER_MATCH_WIDGETS, ...IN_GAME_WIDGETS]
    .map((w) => getWidgetPath(w, userId, tournamentID))
    .filter((url) => url && !url.startsWith("http")); // local paths only
}

export default function DisplayPage() {
  const { userId, tournamentID } = useParams();
  const [activeFrame, setActiveFrame] = useState(null);
  const [pendingFrame, setPendingFrame] = useState(null);
  const [preloadUrls, setPreloadUrls] = useState([]);
  const esRef = useRef(null);
  const pendingFrameRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const frameIdRef = useRef(0);

  const promote = useCallback((frame) => {
    pendingFrameRef.current = null;
    clearTimeout(fallbackTimerRef.current);
    setActiveFrame(frame);
    setPendingFrame(null);
  }, []);

  // Warm the browser cache: load all widget iframes hidden, then discard after 25s.
  // Disable with NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD=true in .env.local for dev.
  useEffect(() => {
    if (!userId || !tournamentID) return;
    if (process.env.NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD === "true") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Cache-warm widget iframes after the display route mounts.
    setPreloadUrls(buildPreloadUrls(userId, tournamentID));
    const timer = setTimeout(() => setPreloadUrls([]), 25_000);
    return () => clearTimeout(timer);
  }, [userId, tournamentID]);

  // Promote pending iframe when it signals readiness via postMessage (WidgetStage)
  const handleMessage = useCallback(
    (event) => {
      if (event.data?.type !== "widget-ready") return;
      const frame = pendingFrameRef.current;
      if (!frame) return;
      promote(frame);
    },
    [promote],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // SSE connection with auto-reconnect
  useEffect(() => {
    if (!tournamentID) return;

    function connect() {
      const es = new EventSource(`/api/sse?tournamentId=${tournamentID}`);
      esRef.current = es;

      es.addEventListener("widget-change", (e) => {
        const { url } = JSON.parse(e.data);
        // Clear screen — no pending phase, take effect immediately
        if (!url) {
          promote(null);
          return;
        }
        const frame = { url, id: ++frameIdRef.current };
        pendingFrameRef.current = frame;
        setPendingFrame(frame);
        // Fallback: promote after 4s for widgets that don't use WidgetStage (e.g. live-ranking)
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => promote(frame), 4000);
      });

      es.onerror = () => {
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      esRef.current?.close();
      clearTimeout(fallbackTimerRef.current);
    };
  }, [tournamentID, promote]);

  const sharedStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: 0,
    background: "transparent",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Active (visible) widget */}
      {activeFrame && (
        <iframe
          key={`${activeFrame.url}:${activeFrame.id}`}
          src={activeFrame.url}
          style={sharedStyle}
          title="widget-display"
        />
      )}

      {/* Pending widget — rendered but invisible; promoted on widget-ready message */}
      {pendingFrame && pendingFrame.id !== activeFrame?.id && (
        <iframe
          key={`${pendingFrame.url}:${pendingFrame.id}`}
          src={pendingFrame.url}
          style={{ ...sharedStyle, opacity: 0, pointerEvents: "none" }}
          title="widget-pending"
        />
      )}

      {/* Cache-warming iframes — hidden, self-destruct after 25s */}
      {preloadUrls.map((url) => (
        <iframe
          key={url}
          src={url}
          style={{ display: "none" }}
          aria-hidden="true"
          title="preload"
        />
      ))}
    </div>
  );
}
