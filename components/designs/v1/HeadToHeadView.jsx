"use client";
import { useHeadToHead } from "@/components/widget-base";

export default function HeadToHeadView({ tournamentID }) {
  const { teamA, teamB, info, ready } = useHeadToHead(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
