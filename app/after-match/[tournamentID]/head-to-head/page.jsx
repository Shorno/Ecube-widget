"use client";
import Layout from "@/components/layout";
import Title from "@/components/Title";
import { use } from "react";
import { useGetHeadToHeadQuery } from "@/lib/services/widget-api";
import Image from "next/image";
import WidgetStage from "@/components/WidgetStage";

const statsConfig = [
  { label: "Damages", key: "total_damages" },
  { label: "Knocks", key: "total_knocks" },
  { label: "Eliminations", key: "total_kills" },
  { label: "Surv.Time", key: "total_survival_time" },
  { label: "Total Points", key: "totalPoints" },
];

function HeadToHead({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetHeadToHeadQuery({ tournamentID });
  const getMaxSurvivalTime = (team) => {
    const players = team?.players ?? [];
    if (!players.length) return null;
    return (
      players.reduce((best, p) =>
        (p?.survival_time_display?.minute ?? 0) >
        (best?.survival_time_display?.minute ?? 0)
          ? p
          : best,
      ).survival_time_display?.text ?? null
    );
  };

  const teamA = data?.data?.[0]
    ? {
        ...data.data[0],
        total_survival_time: getMaxSurvivalTime(data.data[0]),
      }
    : null;
  const teamB = data?.data?.[1]
    ? {
        ...data.data[1],
        total_survival_time: getMaxSurvivalTime(data.data[1]),
      }
    : null;

  if (!data || !data.data) return null;

  return (
    <WidgetStage dataReady={!!data}>
    <Layout top>
      <Title title="Team Head-to-Head" data={data?.info} />
      <div className="wrapper">
        <div className="grid grid-cols-4 gap-4">
          <Teambanner team={teamA} />
          <div className="col-span-2 flex h-100 flex-col gap-5.5">
            {statsConfig.map((stat, idx) => (
              <CompareRow
                key={idx}
                teamA={teamA}
                label={stat.label}
                teamB={teamB}
                statKey={stat.key}
              />
            ))}
          </div>
          <Teambanner team={teamB} />
        </div>
      </div>
    </Layout>
    </WidgetStage>
  );
}

export default HeadToHead;

const Teambanner = ({ team }) => {
  return (
    <div className="">
      <p className="bg-primary p-2 text-center text-3xl font-bold text-white">
        {team?.team_name || ""}
      </p>
      <div className="bg-primary-shade-two grid place-content-center p-2">
        {team?.team_logoUrl ? (
          <Image
            width={400}
            height={400}
            src={team?.team_logoUrl}
            alt="Team Logo"
            priority
          />
        ) : (
          <div className="h-100 w-100 bg-gray-800" />
        )}
      </div>
    </div>
  );
};

const CompareRow = ({ teamA, label, teamB, statKey }) => {
  return (
    <div className="bg-primary grid grid-cols-4 gap-4 p-3">
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamA?.[statKey] ?? 0}
      </div>
      <div className="bg-primary-shade-one col-span-2 mx-auto w-full p-2 text-center text-3xl font-medium text-white uppercase">
        {label}
      </div>
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamB?.[statKey] ?? null}
      </div>
    </div>
  );
};
