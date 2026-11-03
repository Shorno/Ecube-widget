import { promises as fs } from "fs";
import path from "path";
import { parseReplay } from "./parse";

const DEFAULT_FILE = path.join(process.cwd(), "live_data", "pcob-events.jsonl");
// Extracted from a full recording by scripts/extract-recall-replay.js.
const RECALL_FILE = path.join(
  process.cwd(),
  "live_data",
  "pcob-recall-replay.json",
);

// The bundled recording is a static capture — parse it once per process. An
// uploaded match never reaches the server; the control widget parses it in the
// browser and shares it with the display/circle over BroadcastChannel.
let cache = null;
let recallCache = null;

export async function getDefaultReplay() {
  if (!cache) {
    cache = parseReplay(await fs.readFile(DEFAULT_FILE, "utf-8"));
  }
  return cache;
}

export async function getRecallReplay() {
  if (!recallCache) {
    recallCache = JSON.parse(await fs.readFile(RECALL_FILE, "utf-8"));
  }
  return recallCache;
}
