"use client";

import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { use } from "react";
import { useGetTopPlayersQuery } from "@/lib/services/widget-api";
import WidgetStage from "@/components/WidgetStage";

function TopPlayerMatch({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetTopPlayersQuery({ tournamentID });
  const team = data?.data || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
    <Layout top>
      <Title title={"Top Players"} data={data?.game[0]} />

      <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
        <div className="grid grid-cols-5 gap-4">
          {team?.map((player, idx) => (
            <PlayerCard
              key={player.id}
              player={player}
              type="MATCH"
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

export default TopPlayerMatch;
