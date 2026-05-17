"use client";
import { useTopPlayersGroup } from "@/components/widget-base";

export default function TopPlayersGroupView({ tournamentID }) {
  const { players, info, ready } = useTopPlayersGroup(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
