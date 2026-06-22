import type { LiveRankEntry } from "./live-rank";

/** WebSocket payload: { event: "TOP_FOUR", data: TopFourPayload } */
export type TopFourPayload = LiveRankEntry[];
