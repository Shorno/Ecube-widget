"use client";
import { use, useState } from "react";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";
import MVPPage from "@/components/MVPPage";
import WidgetStage from "@/components/WidgetStage";

function MvpMatch({ params }) {
  const { tournamentID } = use(params);
  const { data }         = useGetMvpMatchQuery({ tournamentID });
  const [stageReady, setStageReady] = useState(false);
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data} onReady={() => setStageReady(true)}>
      <MVPPage mvp={mvp} stageReady={stageReady} />
    </WidgetStage>
  );
}

export default MvpMatch;
