"use client";

import { cn } from "@/lib/utils";
import { useWWC } from "@/hooks/widget-data";
import WidgetStage from "@/components/common/WidgetStage";

export default function WWCDView({ tournamentID }: { tournamentID: string }) {
  const { team, players, ready } = useWWC(tournamentID);

  if (!ready || !team) return null;

  return (
    <WidgetStage dataReady={ready} onReady={animate}>
      
    </WidgetStage>
  );
}
