export default function WidgetStatusBanner({ status, onDismiss }) {
  if (!status) return null;

  const title =
    status.kind === "data-refresh"
      ? "Widget hidden — live data refresh failed"
      : "Widget hidden — image failed to load";

  return (
    <div className="border-b border-red-700 bg-red-950 px-5 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold tracking-widest text-red-400 uppercase">
            ⚠ {title}
          </p>
          <p className="mb-1 text-xs text-red-300">{status.message}</p>
          <p className="mb-1 text-xs text-red-500">
            Widget: <span className="font-mono">{status.widgetUrl}</span>
          </p>
          {(status.details ?? []).map((detail, index) => (
            <p
              key={`${detail}-${index}`}
              className="truncate font-mono text-xs text-red-400"
            >
              ✗ {detail}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="my-auto shrink-0 bg-red-900 p-4 text-xs font-bold text-red-100 hover:text-red-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
