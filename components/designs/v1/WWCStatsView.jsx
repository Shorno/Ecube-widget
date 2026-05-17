"use client";
import { useWWC } from "@/components/widget-base";

export default function WWCStatsView({ tournamentID }) {
  const { team, players, gameInfo, ready } = useWWC(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual (player stats breakdown)
  return null;
}
