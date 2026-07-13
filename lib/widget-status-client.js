function sendWidgetStatus(status) {
  if (typeof window === "undefined") return Promise.resolve();

  return fetch("/api/widget-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      widgetUrl: window.location.pathname,
      ...status,
    }),
  }).catch(() => {});
}

export function reportWidgetError({ kind, message, details = [] }) {
  return sendWidgetStatus({
    state: "error",
    kind,
    message,
    details,
  });
}

export function clearWidgetError() {
  return sendWidgetStatus({ state: "ready" });
}
