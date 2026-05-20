"use client";

import { useState, useEffect, useRef } from "react";
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
  const [widgetUrl, setWidgetUrl] = useState(null);
  const [preloadUrls, setPreloadUrls] = useState([]);
  const esRef = useRef(null);

  // Warm the browser cache: load all widget iframes hidden, then discard after 25s.
  // Disable with NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD=true in .env.local for dev.
  useEffect(() => {
    if (!userId || !tournamentID) return;
    if (process.env.NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD === "true") return;
    setPreloadUrls(buildPreloadUrls(userId, tournamentID));
    const timer = setTimeout(() => setPreloadUrls([]), 25_000);
    return () => clearTimeout(timer);
  }, [userId, tournamentID]);

  // SSE connection with auto-reconnect
  useEffect(() => {
    if (!tournamentID) return;

    function connect() {
      const es = new EventSource(`/api/sse?tournamentId=${tournamentID}`);
      esRef.current = es;

      es.addEventListener("widget-change", (e) => {
        const { url } = JSON.parse(e.data);
        setWidgetUrl(url);
      });

      es.onerror = () => {
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => esRef.current?.close();
  }, [tournamentID]);

  return (
    <>
      {widgetUrl ? (
        <iframe
          key={widgetUrl}
          src={widgetUrl}
          className="h-screen w-screen border-0"
          style={{ background: "transparent" }}
          title="widget-display"
        />
      ) : (
        <div className="h-screen w-screen bg-transparent" />
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
    </>
  );
}
