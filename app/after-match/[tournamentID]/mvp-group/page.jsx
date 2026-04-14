"use client";

import { use } from "react";
import MVPPage from "@/components/MVPPage";
import { useGetMvpGroupQuery } from "@/lib/services/widget-api";

function MVPGroup({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetMvpGroupQuery({ tournamentID });
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return <MVPPage mvp={mvp} isGroup={true} />;
}

export default MVPGroup;
