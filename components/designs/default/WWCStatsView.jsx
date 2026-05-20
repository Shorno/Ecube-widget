"use client";

import Layout from "@/components/common/Layout";
import PlayerCard from "@/components/widgets/PlayerCard";
import Title from "@/components/common/Title";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import WidgetStage from "@/components/common/WidgetStage";

export default function WWCStatsView({ tournamentID }) {
  const { data } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team = data?.data?.[0]?.players || [];

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <Layout top>
        <Title title={"WWCD Stats"} data={data?.game[0]} />
        <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
          <div className="space-y-8 uppercase">
            <div className="bg-primary-shade-two mx-auto w-max">
              <p className="bg-primary-shade-one p-1 text-center text-2xl font-bold text-white">
                {data?.data[0]?.team_name}
              </p>
              <Image
                priority
                src={data?.data[0]?.team_image}
                width={180}
                height={180}
                alt=""
                className="mx-auto"
              />
            </div>
            <Databox title="Eliminations" value={data?.data[0]?.total_kills} />
            <Databox title="Total Damage" value={data?.data[0]?.total_damage} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {team?.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}

const Databox = ({ title, value }) => (
  <div className="bg-primary relative w-55 px-18 py-8">
    <div className="bg-primary-shade-one absolute -top-3.75 left-1/2 h-7.5 translate-x-[-50%] p-1 whitespace-nowrap">
      {title}
    </div>
    <p className="text-center text-5xl font-bold text-black">{value}</p>
  </div>
);
