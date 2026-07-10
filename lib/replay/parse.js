// Parse a JSONL recording (one PCOB event per line) into the normalized shape
// the widgets consume. Pure — no Node APIs — so it runs on the server (bundled
// file) and in the browser (a locally uploaded file) alike. Tolerant of
// truncated lines and unchanged polls, like the original file loader.
export function parseReplay(raw) {
  const events = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue; // tolerate a truncated trailing line from the recorder
    }

    // Skip the session header and unchanged polls — an unchanged poll carries
    // the exact same body as the previous one, so dropping it never loses state.
    if (!entry.route || !entry.changed) continue;

    events.push({ ts: Date.parse(entry.ts), route: entry.route, body: entry.body });
  }

  events.sort((a, b) => a.ts - b.ts);

  const startTs = events[0]?.ts ?? 0;
  const normalized = events.map(({ ts, route, body }) => ({
    t: ts - startTs, // ms since the first recorded event
    route,
    body,
  }));

  return {
    duration: normalized.at(-1)?.t ?? 0,
    count: normalized.length,
    events: normalized,
  };
}
