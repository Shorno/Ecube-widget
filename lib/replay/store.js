import { promises as fs } from "fs";
import path from "path";
import { parseReplay } from "./parse";

const DEFAULT_FILE = path.join(process.cwd(), "live_data", "pcob-events.jsonl");

// The bundled recording is a static capture — parse it once per process. An
// uploaded match never reaches the server; the control widget parses it in the
// browser and shares it with the display/circle over BroadcastChannel.
let cache = null;

export async function getDefaultReplay() {
  if (!cache) {
    cache = parseReplay(await fs.readFile(DEFAULT_FILE, "utf-8"));
  }
  return cache;
}
