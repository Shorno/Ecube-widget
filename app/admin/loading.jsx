export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-32 rounded bg-gray-800" />
          <div className="h-4 w-40 rounded bg-gray-800" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-36 rounded bg-gray-800" />
          <div className="h-9 w-28 rounded bg-gray-800" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/60">
        {/* Header row */}
        <div className="grid grid-cols-6 gap-4 border-b border-gray-800 px-6 py-3">
          {["w-16","w-16","w-16","w-24","w-32","w-8"].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-gray-800`} />
          ))}
        </div>
        {/* Data rows */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-6 gap-4 border-b border-gray-800/60 px-6 py-5 last:border-0">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-800" />
              <div className="h-3 w-36 rounded bg-gray-800" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-800" />
              <div className="h-3 w-12 rounded bg-gray-800" />
            </div>
            <div className="h-6 w-20 rounded bg-gray-800" />
            <div className="h-4 w-20 rounded bg-gray-800" />
            <div className="h-3 w-40 rounded bg-gray-800" />
            <div className="ml-auto h-8 w-14 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
