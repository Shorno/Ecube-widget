"use client";
import { useWWC } from "@/components/widget-base";

export default function WWCView({ tournamentID }) {
  const { team, players, gameInfo, ready } = useWWC(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
