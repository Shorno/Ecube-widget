"use client";

import { useState } from "react";
import { useMVP } from "@/hooks/widget-data";
import MVPDisplay from "@/components/widgets/MVPDisplay";
import WidgetStage from "@/components/common/WidgetStage";

export default function MVPView({ tournamentID, preview = false }) {
  const { mvp, ready } = useMVP(tournamentID, { preview });
  const [stageReady, setStageReady] = useState(false);

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <MVPDisplay mvp={mvp} stageReady={stageReady} />
    </WidgetStage>
  );
}
