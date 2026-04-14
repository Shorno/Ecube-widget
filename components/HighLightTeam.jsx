import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";

const HighLightTeam = ({ teamOne }) => {
  return (
    <div className="bg-primary-shade-two relative flex h-46 w-full">
      <div className="bg-primary absolute top-0 left-0 px-2 py-3 text-3xl font-bold text-white">
        #{teamOne?.position}
      </div>
      <div className="flex w-[70%] items-center justify-center">
        <p className="text-5xl font-extrabold text-white">
          {teamOne?.team_clanTag}
        </p>
      </div>
      <div className="flex h-full w-[30%] flex-col">
        <div className="flex h-[50%] items-center justify-center  gap-1 p-1">
          {teamOne?.team_logoUrl && (
            <Image
              src={teamOne.team_logoUrl}
              alt="team logo"
              width={64}
              height={64}
            />
          )}
          <p className="text-[clamp(16px,22px,1.5rem)] font-bold text-nowrap">
            {teamOne.team_name}
          </p>
          <p className="text-3xl">
            <GiChickenOven />
          </p>
        </div>
        <div className="bg-primary flex h-[50%] px-2 text-4xl">
          <div className="grid h-full w-[80.67px] place-content-center text-center">
            {teamOne?.positionPoints}
          </div>
          <div className="grid h-full w-[80.67px] place-content-center text-center">
            {teamOne?.kills}
          </div>
          <div className="grid h-full w-[80.67px] place-content-center text-center">
            {teamOne?.totalPoints}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighLightTeam;
