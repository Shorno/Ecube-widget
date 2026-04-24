import { AFTER_MATCH_WIDGETS, IN_GAME_WIDGETS } from "@/lib/widget-catalog";

export default async function WidgetsPage({ params }) {
  const { userId, tournamentID } = await params;

  function getUrl(widget) {
    if (widget.path) return widget.path;
    const section = widget.section === "in-game" ? "in-game" : "after-match";
    return `/${userId}/${tournamentID}/${section}/${widget.slug}`;
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      <h1 className="mb-6 text-xl font-bold tracking-widest text-gray-300 uppercase">Widget URLs</h1>
      <p className="mb-8 text-xs text-gray-500">Tournament: {tournamentID}</p>

      {[{ title: "In-Game", list: IN_GAME_WIDGETS }, { title: "After Match", list: AFTER_MATCH_WIDGETS }].map(({ title, list }) => (
        <section key={title} className="mb-8">
          <h2 className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">{title}</h2>
          <div className="space-y-1">
            {list.map((w) => {
              const url = getUrl(w);
              return (
                <div key={w.id} className="flex items-center gap-4 border border-gray-800 bg-gray-900 px-4 py-2">
                  <span className="w-40 shrink-0 text-xs font-bold text-gray-300">{w.label}</span>
                  <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs text-blue-400 hover:underline truncate">{url}</a>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
