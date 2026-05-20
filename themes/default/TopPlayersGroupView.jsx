"use client";

import Layout from "@/components/common/Layout";
import PlayerCard from "@/components/widgets/PlayerCard";
import Title from "@/components/common/Title";
import { useGetTopPlayersGroupQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/common/WidgetStage";

export default function TopPlayersGroupView({ tournamentID }) {
  const { data } = useGetTopPlayersGroupQuery({ tournamentID });
  const team = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <Layout top>
        <Title title="Overall Top Players" stageOnly data={data?.game[0]} />
        <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
          <div className="grid grid-cols-5 gap-4">
            {team?.map((player, idx) => (
              <PlayerCard
                key={player.id}
                player={player}
                type="OVERALL"
                rank={idx + 1}
                showTeamLogo
              />
            ))}
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}
