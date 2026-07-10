"use client";

import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayViewer } from "@/hooks/useReplaySync";
import { buildTimeline, circleTimerAt } from "@/lib/replay/timeline";
import CircleTimer from "@/components/replay/CircleTimer";

// Broadcast overlay: PUBG-style zone countdown, mirroring the Replay Control
// clock in the same browser. Transparent and self-hiding, so it can sit over
// the map feed wherever OBS places it.
export default function ReplayCirclePage() {
  const { data: defaultData } = useGetReplayEventsQuery();
  const { time, localData } = useReplayViewer();

  // A match loaded on the control widget takes precedence over the default.
  const data = localData ?? defaultData;
  const timer = data ? circleTimerAt(buildTimeline(data.events), time) : null;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-transparent">
      <CircleTimer timer={timer} />
    </div>
  );
}
