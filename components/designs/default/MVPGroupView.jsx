"use client";

import { useState } from "react";
import MVPDisplay from "@/components/widgets/MVPDisplay";
import { useGetMvpGroupQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/common/WidgetStage";

export default function MVPGroupView({ tournamentID }) {
  const { data } = useGetMvpGroupQuery({ tournamentID });
  const [stageReady, setStageReady] = useState(false);
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <MVPDisplay mvp={mvp} isGroup stageReady={stageReady} />
    </WidgetStage>
  );
}
