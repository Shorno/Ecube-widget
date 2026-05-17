"use client";
import { useAfterMatchScoreGroup } from "@/components/widget-base";

export default function AfterMatchScoreGroupView({ tournamentID }) {
  const { winner, col1, col2, info, ready } = useAfterMatchScoreGroup(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
