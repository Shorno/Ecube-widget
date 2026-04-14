"use client";
import { use } from "react";
import { useGetMvpMatchQuery } from "@/lib/services/widget-api";
import MVPPage from "@/components/MVPPage";

function MvpMatch({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetMvpMatchQuery({ tournamentID });
  const mvp = data?.data || [];

  if (!data || !data.data) return null;

  return <MVPPage mvp={mvp} />;
}

export default MvpMatch;
