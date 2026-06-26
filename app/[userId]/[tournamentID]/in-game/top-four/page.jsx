import { cn } from "@/lib/utils";
import TeamFlag from "@/components/common/TeamFlag";
import TopFourPreview from "./TopFourPreview";

const demoData = [
  {
    id: 1,
    position: 1,
    name: "TSV OFFICIALS",
    score: 14,
    image: "https://tournalink.com/storage/83087/014.png",
    clan_tag: "TSVO",
    country_code: "BD",
    is_eliminated: false,
    win_chance: 95,
    players: [
      { is_alive: true, is_knocked: false, health: 97 },
      { is_alive: true, is_knocked: false, health: 100 },
      { is_alive: true, is_knocked: true, health: 75 },
      { is_alive: true, is_knocked: false, health: 10 },
    ],
  },
  {
    id: 2,
    position: 2,
    name: "TERROR REIGN X",
    score: 4,
    image: "https://tournalink.com/storage/71821/003.png",
    clan_tag: "TRX",
    country_code: "PK",
    is_eliminated: false,
    win_chance: 5,
    players: [
      { is_alive: true, is_knocked: false, health: 100 },
      { is_alive: false, is_knocked: true, health: 0 },
      { is_alive: false, is_knocked: true, health: 0 },
      { is_alive: false, is_knocked: true, health: 0 },
    ],
  },
];

export default async function TopFourPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams?.preview === "1";

  if (isPreview) {
    return <TopFourPreview />;
  }

  return <TopFourWidget />;
}

function TopFourWidget() {
  return (
    <div className="relative h-screen bg-transparent">
      <div className="absolute top-12 left-1/2 grid -translate-x-1/2 grid-cols-4 items-center gap-x-8 gap-y-4">
        {demoData?.map((team, index) => (
          <div
            key={index}
            className={cn(
              "relative flex h-12 w-55 border-b-2 border-l-4 border-blue-400 bg-[#414098]",
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TeamFlag
                  team={team}
                  className="shrink-0"
                  imageClassName="h-[24px] w-[32px] object-cover"
                />
                <p className="font-bold text-white">{team.clan_tag}</p>
              </div>
              <div className="flex h-full gap-2 bg-blue-200 p-2">
                {team?.players?.map((player, idx) => (
                  <div key={idx} className="relative w-1.5 bg-gray-400">
                     <div
                      className={cn(
                        "absolute bottom-0 w-full transition-all duration-300",
                        player?.is_alive ? "bg-green-500" : "bg-red-500",
                        player?.is_knocked && "bg-red-500",
                      )}
                      style={{ height: `${player?.health}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {team?.is_eliminated && (
              <div className="absolute inset-0 bg-black/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
