"use client";

import { useGetReplayEventsQuery } from "@/lib/services/replay-api";
import { useReplayViewer } from "@/hooks/useReplaySync";
import {
  buildTeamLogoLookup,
  buildTimeline,
  finalTeamStandings,
} from "@/lib/replay/timeline";
import {
  deriveReplayState,
  filterReplayMapState,
} from "@/lib/replay/deriveState";
import { ERANGEL } from "@/lib/replay/maps";
import MiniMap from "@/components/replay/MiniMap";
import Centered from "@/components/replay/Centered";

// The broadcast output: nothing but the map, mirroring whatever the Replay
// Control is playing. Open /replay/control alongside this to drive it.
export default function ReplayDisplayPage() {
  const { data: defaultData, isError } = useGetReplayEventsQuery();
  const { time, localData, visibleTeamIds } = useReplayViewer();

  // A match loaded on the control widget takes precedence over the default.
  const data = localData ?? defaultData;

  if (!data)
    return (
      <Centered>
        {isError ? "Failed to load replay recording" : "Loading replay…"}
      </Centered>
    );

  const timeline = buildTimeline(data.events);
  const replayState = deriveReplayState(timeline, time, ERANGEL);
  const teamStandings = finalTeamStandings(timeline);
  const defaultTeamIds = teamStandings
    .slice(0, 4)
    .map((team) => String(team.teamId));
  const teamLogoById = buildTeamLogoLookup(teamStandings);
  const mapState = filterReplayMapState(
    replayState,
    visibleTeamIds ?? defaultTeamIds,
  );

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 p-4">
      <div className="aspect-square h-full max-w-full">
        <MiniMap
          world={ERANGEL}
          players={mapState.players}
          trails={mapState.trails}
          zone={replayState.zone}
          plane={replayState.plane}
          planePosition={replayState.planePosition}
          killMarkers={mapState.killMarkers}
          observedUid={replayState.observedUid}
          teamLogoById={teamLogoById}
        />
      </div>
    </div>
  );
}
