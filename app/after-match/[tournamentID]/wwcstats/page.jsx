"use client";
import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { use } from "react";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import WidgetStage from "@/components/WidgetStage";

function WWCStats({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetWwcdTeamStatsQuery({ tournamentID });
  const team = data?.data?.players || {};

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
      <Layout top className={""}>
        <Title title={"WWCD Stats"} data={data?.info} />
        <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
          {/* team stats */}
          <div className="space-y-8 uppercase">
            <div className="bg-primary-shade-two mx-auto w-max">
              <p className="bg-primary-shade-one p-1 text-center text-2xl font-bold text-white">
                {data?.data?.team_name}
              </p>
              <Image
                priority
                src={data?.data?.team_logoUrl}
                width={180}
                height={180}
                alt=""
                className="mx-auto"
              />
            </div>

            <Databox title="Eliminations" value={data?.data?.total_kills} />
            <Databox title="Total Damage" value={data?.data?.total_damages} />
          </div>

          {/* player  stats */}
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

export default WWCStats;

const Databox = ({ title, value }) => {
  return (
    <div className="bg-primary relative w-55 px-18 py-8">
      <div className="bg-primary-shade-one absolute -top-3.75 left-1/2 h-7.5 translate-x-[-50%] p-1 whitespace-nowrap">
        {title}
      </div>
      <p className="text-center text-5xl font-bold text-black">{value}</p>
    </div>
  );
};
