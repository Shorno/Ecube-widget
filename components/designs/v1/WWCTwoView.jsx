"use client";
import { useWWC } from "@/components/widget-base";

export default function WWCTwoView({ tournamentID }) {
  const { team, players, ready } = useWWC(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual (alternative WWC layout)
  return null;
}
