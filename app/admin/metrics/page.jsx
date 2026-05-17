import Link from "next/link";
import MetricsPanel from "../_components/MetricsPanel";

export default function AdminMetricsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Metrics</h1>
          <p className="mt-1 text-sm text-gray-500">
            In-process ring buffer — last 1 000 requests. Resets on server restart.
          </p>
        </div>
        <Link href="/admin"
          className="rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition-colors">
          ← Dashboard
        </Link>
      </div>
      <MetricsPanel />
    </div>
  );
}
