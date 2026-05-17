"use client";
import { useMVP } from "@/components/widget-base";

export default function MVPView({ tournamentID }) {
  const { player, mvp, ready } = useMVP(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
