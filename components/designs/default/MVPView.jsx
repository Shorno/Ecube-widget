"use client";

import { useState } from "react";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";
import MVPDisplay from "@/components/widgets/MVPDisplay";
import WidgetStage from "@/components/common/WidgetStage";

export default function MVPView({ tournamentID }) {
  const { data } = useGetMvpMatchQuery({ tournamentID });
  const [stageReady, setStageReady] = useState(false);
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <MVPDisplay mvp={mvp} stageReady={stageReady} />
    </WidgetStage>
  );
}
