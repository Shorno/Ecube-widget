"use client";

import { useState } from "react";
import MVPDisplay from "@/components/widgets/MVPDisplay";
import { useMVPGroup } from "@/hooks/widget-data";
import WidgetStage from "@/components/common/WidgetStage";

export default function MVPGroupView({ tournamentID, preview = false }) {
  const { mvp, ready } = useMVPGroup(tournamentID, { preview });
  const [stageReady, setStageReady] = useState(false);

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <MVPDisplay mvp={mvp} isGroup stageReady={stageReady} />
    </WidgetStage>
  );
}
