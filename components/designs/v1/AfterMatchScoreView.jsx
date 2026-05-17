"use client";
import { useAfterMatchScore } from "@/components/widget-base";

export default function AfterMatchScoreView({ tournamentID }) {
  const { winner, col1, col2, info, ready } = useAfterMatchScore(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
