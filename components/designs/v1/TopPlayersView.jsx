"use client";
import { useTopPlayers } from "@/components/widget-base";

export default function TopPlayersView({ tournamentID }) {
  const { players, info, ready } = useTopPlayers(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
