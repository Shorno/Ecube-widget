"use client";

import { useEffect, useRef, useState } from "react";
import type { TeamRecallPayload } from "@/types/team-recall";
import { useReplayPlayer } from "@/hooks/useReplayPlayer";
import { useGetRecallReplayQuery } from "@/lib/services/replay-api";
import {
  buildRecallTimeline,
  extractRecallReplay,
} from "@/lib/replay/recallReplay";

// Jumping to a recall starts a little before it so the card's arrival is seen.
const JUMP_LEAD_MS = 2000;

type Options = {
  enqueue: (payload: TeamRecallPayload) => void;
  reset: () => void;
};

/**
 * Preview-only: plays a recorded match's recall packets into the recall queue
 * at the moments they happened, as if the backend were broadcasting them live.
 * Defaults to the bundled recording; a full PCOB .jsonl can be loaded instead.
 */
export function useRecallReplay({ enqueue, reset }: Options) {
  const { data: bundled, isError } = useGetRecallReplayQuery(undefined);
  const [uploaded, setUploaded] = useState<{
    name: string;
    replay: ReturnType<typeof extractRecallReplay>;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const replay = uploaded?.replay ?? bundled;
  const timeline = replay ? buildRecallTimeline(replay) : null;
  const player = useReplayPlayer(replay?.duration ?? 0, 1);
  // Replay time already emitted up to; -1 so a packet at t=0 still plays.
  const playedUntilRef = useRef(-1);

  // The clock ticks inside useReplayPlayer; pushing the packets it passes into
  // the recall queue is a sync with state outside this component.
  useEffect(() => {
    if (!timeline) return;
    const from = playedUntilRef.current;
    playedUntilRef.current = player.time;
    for (const { t, payload } of timeline.emissions) {
      if (t > from && t <= player.time) {
        enqueue({
          ...payload,
          recalledAt: new Date().toISOString(),
        } as TeamRecallPayload);
      }
    }
  }, [timeline, player.time, enqueue]);

  // A seek clears whatever is on screen and skips the packets in between, so
  // only recalls from the new position onwards play.
  function seek(time: number) {
    reset();
    playedUntilRef.current = time;
    player.seek(time);
  }

  function jumpTo(time: number) {
    seek(Math.max(0, time - JUMP_LEAD_MS));
    if (!player.isPlaying) player.togglePlay();
  }

  async function loadFile(file: File) {
    setUploadError(null);
    const parsed = extractRecallReplay(await file.text());
    if (parsed.events.length === 0) {
      setUploadError("No recall packets in this file");
      return;
    }
    if (player.isPlaying) player.togglePlay();
    seek(0);
    setUploaded({ name: file.name, replay: parsed });
  }

  return {
    ...player,
    duration: replay?.duration ?? 0,
    moments: timeline?.moments ?? [],
    sourceName: uploaded?.name ?? "Bundled match",
    error: isError ? "Failed to load bundled recall replay" : uploadError,
    seek,
    jumpTo,
    loadFile,
  };
}
