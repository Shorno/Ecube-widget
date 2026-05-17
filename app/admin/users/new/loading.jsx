export default function NewUserLoading() {
  return (
    <div className="max-w-lg space-y-8 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 rounded bg-gray-800" />
        <div className="h-7 w-28 rounded bg-gray-800" />
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded bg-gray-800" />
            <div className="h-11 rounded bg-gray-800" />
          </div>
        ))}
        <div className="h-14 rounded bg-gray-800" />
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded bg-gray-800" />
          <div className="h-10 w-20 rounded bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
