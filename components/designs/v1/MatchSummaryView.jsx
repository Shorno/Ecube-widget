"use client";
import { useMatchSummary } from "@/components/widget-base";

export default function MatchSummaryView({ tournamentID }) {
  const { stats, info, ready } = useMatchSummary(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
