"use client";

import type { TeamRecallPayload } from "@/types/team-recall";
import { RECALL_PREVIEW_SCENARIOS } from "@/hooks/widget-data/mockTeamRecall";
import RecallReplayPanel from "./RecallReplayPanel";

type Props = {
  isLocked: boolean;
  onTrigger: (scenarioKey: string) => void;
  onReset: () => void;
  onEnqueue: (payload: TeamRecallPayload) => void;
};

// Preview-only controls: each scenario replays mock TEAM_RECALL events the
// way PCOB delivers them, and the match replay plays a recorded match's real
// recalls, so the animation can be checked without a live match.
export default function TeamRecallPreviewPanel({
  isLocked,
  onTrigger,
  onReset,
  onEnqueue,
}: Props) {
  return (
    <div className="fixed top-5 right-5 z-50 flex w-64 flex-col gap-2">
      <div className="flex flex-col gap-1.5 rounded bg-black/75 p-2.5 shadow-lg">
        <div className="flex items-center justify-between pb-0.5 font-mono text-[10px] uppercase">
          <span className="text-white/70">Recall preview</span>
          <span className={isLocked ? "text-yellow-300" : "text-white/40"}>
            {isLocked ? "Playing" : "Idle"}
          </span>
        </div>
        {RECALL_PREVIEW_SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => onTrigger(scenario.key)}
            className="rounded bg-white px-3 py-1.5 text-left text-xs font-bold text-black shadow hover:bg-gray-100"
          >
            {scenario.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="rounded border border-white/30 px-3 py-1.5 text-left text-xs font-bold text-white hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <RecallReplayPanel onEnqueue={onEnqueue} onReset={onReset} />
    </div>
  );
}
