export default function EditUserLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 rounded bg-gray-800" />
        <div className="space-y-1">
          <div className="h-7 w-48 rounded bg-gray-800" />
          <div className="h-3 w-40 rounded bg-gray-800" />
        </div>
      </div>

      {/* Account section */}
      <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6">
        <div className="h-5 w-20 rounded bg-gray-800" />
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="h-3 w-12 rounded bg-gray-800" />
            <div className="h-11 rounded bg-gray-800" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 rounded bg-gray-800" />
            <div className="h-11 rounded bg-gray-800" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-gray-800" />
          <div className="h-11 rounded bg-gray-800" />
        </div>
        <div className="h-16 rounded bg-gray-800" />
      </div>

      {/* Design section */}
      <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6">
        <div className="h-5 w-16 rounded bg-gray-800" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>

      {/* Tournament IDs section */}
      <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6">
        <div className="h-5 w-40 rounded bg-gray-800" />
        <div className="flex gap-3">
          <div className="h-11 flex-1 rounded bg-gray-800" />
          <div className="h-11 w-20 rounded bg-gray-800" />
        </div>
      </div>

      {/* Widget Access section */}
      <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-6">
        <div className="h-5 w-28 rounded bg-gray-800" />
        <div className="h-16 rounded bg-gray-800" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 pt-6">
        <div className="h-10 w-36 rounded bg-gray-800" />
        <div className="h-8 w-24 rounded bg-gray-800" />
      </div>
    </div>
  );
}
