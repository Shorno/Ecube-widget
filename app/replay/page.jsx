"use client";

import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayViewer } from "@/hooks/useReplaySync";
import { buildTimeline } from "@/lib/replay/timeline";
import { deriveReplayState } from "@/lib/replay/deriveState";
import { ERANGEL } from "@/lib/replay/maps";
import MiniMap from "@/components/replay/MiniMap";
import Centered from "@/components/replay/Centered";

// The broadcast output: nothing but the map, mirroring whatever the Replay
// Control is playing. Open /replay/control alongside this to drive it.
export default function ReplayDisplayPage() {
  const { data, isLoading, isError } = useGetReplayEventsQuery();
  const time = useReplayViewer();

  if (isLoading) return <Centered>Loading replay…</Centered>;
  if (isError || !data)
    return <Centered>Failed to load replay recording</Centered>;

  const timeline = buildTimeline(data.events);
  const { players, zone, plane, trails, killMarkers, observedUid } =
    deriveReplayState(timeline, time, ERANGEL);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 p-4">
      <div className="aspect-square h-full max-w-full">
        <MiniMap
          world={ERANGEL}
          players={players}
          trails={trails}
          zone={zone}
          plane={plane}
          killMarkers={killMarkers}
          observedUid={observedUid}
        />
      </div>
    </div>
  );
}
