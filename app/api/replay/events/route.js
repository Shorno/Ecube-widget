import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const REPLAY_FILE = path.join(process.cwd(), "live_data", "pcob-events.jsonl");

// The recording is a static capture — parse it once per process, not per request.
let cache = null;

async function loadReplay() {
  if (cache) return cache;

  const raw = await fs.readFile(REPLAY_FILE, "utf-8");
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

  cache = {
    duration: normalized.at(-1)?.t ?? 0,
    count: normalized.length,
    events: normalized,
  };
  return cache;
}

export async function GET() {
  try {
    return NextResponse.json(await loadReplay());
  } catch {
    return NextResponse.json(
      { error: "Failed to load replay recording" },
      { status: 500 },
    );
  }
}
