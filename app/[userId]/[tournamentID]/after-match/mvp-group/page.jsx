"use client";
import { use, useState } from "react";
import MVPPage from "@/components/MVPPage";
import { useGetMvpGroupQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/WidgetStage";

function MVPGroup({ params }) {
  const { tournamentID } = use(params);
  const { data }         = useGetMvpGroupQuery({ tournamentID });
  const [stageReady, setStageReady] = useState(false);
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <MVPPage mvp={mvp} isGroup stageReady={stageReady} />
    </WidgetStage>
  );
}

export default MVPGroup;
