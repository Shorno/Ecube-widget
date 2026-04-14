"use client";
import { use } from "react";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";
import MVPPage from "@/components/MVPPage";
import WidgetStage from "@/components/WidgetStage";

function MvpMatch({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetMvpMatchQuery({ tournamentID });
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <MVPPage mvp={mvp} />
    </WidgetStage>
  );
}

export default MvpMatch;
