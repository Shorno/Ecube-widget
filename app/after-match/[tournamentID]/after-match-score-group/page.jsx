"use client";

import Layout from "@/components/layout";
import Tableheader from "@/components/Tableheader";
import TableRow from "@/components/TableRow";
import Title from "@/components/Title";
import { useGetAfterMatchScoreGroupQuery } from "@/lib/services/widget-api";
import { use } from "react";
import WidgetStage from "@/components/WidgetStage";

function AfterMatchScoreGroup({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetAfterMatchScoreGroupQuery({ tournamentID });
  const teams = data?.data || [];
  const colOne = teams.slice(0, 8);
  const colTwo = teams.slice(8, 16);

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
    <Layout top>
      <Title title="Overall Standing" stageOnly data={data?.info} />
      <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
        <div className="mx-auto w-215 space-y-2">
          <Tableheader overall />
          <div className="space-y-2">
            {colOne.map((team) => (
              <TableRow key={team.team_id} team={team} overall />
            ))}
          </div>
        </div>
        <div className="mx-auto w-215 space-y-2">
          <Tableheader overall />
          <div className="space-y-2">
            {colTwo.map((team) => (
              <TableRow key={team.team_id} team={team} overall />
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </WidgetStage>
  );
}

export default AfterMatchScoreGroup;
