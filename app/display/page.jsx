"use client";

import { useState, useEffect, useRef } from "react";

export default function DisplayPage() {
  const [widgetUrl, setWidgetUrl] = useState(null);
  const esRef = useRef(null);

  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/sse");
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
  }, []);

  if (!widgetUrl) {
    return <div className="h-screen w-screen bg-transparent" />;
  }

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
