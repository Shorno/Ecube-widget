// Pull the recall timeline out of a full PCOB recording so the recall widget's
// preview can replay a real match without shipping the whole (tens of MB) log.
//
//   node scripts/extract-recall-replay.js <pcob-events.jsonl> [out.json]
import { promises as fs } from "fs";
import path from "path";
import { extractRecallReplay } from "../lib/replay/recallReplay.js";

// Default output is next to the widget's other recordings, wherever the script
// is run from.
const DEFAULT_OUTPUT = path.join(
  import.meta.dirname,
  "..",
  "live_data",
  "pcob-recall-replay.json",
);

const [, , input, output = DEFAULT_OUTPUT] = process.argv;

if (!input) {
  console.error(
    "Usage: node scripts/extract-recall-replay.js <events.jsonl> [out.json]",
  );
  process.exit(1);
}

const replay = extractRecallReplay(await fs.readFile(input, "utf-8"));
await fs.writeFile(output, JSON.stringify(replay, null, 2));
console.log(
  `Wrote ${output}: ${replay.events.length} recall packets, ` +
    `${Object.keys(replay.roster).length} players, ` +
    `${Math.round(replay.duration / 1000)}s`,
);
