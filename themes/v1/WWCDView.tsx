"use client";

import { cn } from "@/lib/utils";
import { useWWC } from "@/hooks/widget-data";
import WidgetStage from "@/components/common/WidgetStage";

export default function WWCDView({ tournamentID }: { tournamentID: string }) {
  const { team, players, ready } = useWWC(tournamentID);
  const [stageReady, setStageReady] = useState(false);
  if (!ready || !team) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <p>s</p>
    </WidgetStage>
  );
}
