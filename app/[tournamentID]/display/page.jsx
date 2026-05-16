"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export default function DisplayPage() {
  const { tournamentID } = useParams();
  const [widgetUrl, setWidgetUrl] = useState(null);
  const esRef = useRef(null);

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

  if (!widgetUrl) return <div className="h-screen w-screen bg-transparent" />;

  return (
    <iframe
      key={widgetUrl}
      src={widgetUrl}
      className="h-screen w-screen border-0"
      style={{ background: "transparent" }}
      title="widget-display"
    />
  );
}
