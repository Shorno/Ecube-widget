"use client";
import { useMVPGroup } from "@/components/widget-base";

export default function MVPGroupView({ tournamentID }) {
  const { player, mvp, ready } = useMVPGroup(tournamentID);
  if (!ready) return null;
  // TODO: implement v1 visual
  return null;
}
