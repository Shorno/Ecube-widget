import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";

const HighLightTeam = ({ teamOne }) => {
  const playerOne = teamOne?.players?.[0] || {};
  const playerTwo = teamOne?.players?.[1] || {};
  const playerThree = teamOne?.players?.[2] || {};
  const playerFour = teamOne?.players?.[3] || {};

  return (
    <div className="bg-primary-shade-two relative flex h-46 w-full">
      <div className="bg-primary absolute top-0 left-0 px-2 py-3 text-3xl font-bold text-white">
        #{teamOne?.position}
      </div>
      <div className="relative flex w-[70%] items-center justify-center overflow-hidden">
        <div className="absolute -bottom-24 mx-auto flex">
          <Image
            src={playerOne?.player_imageUrl}
            alt=""
            width={170}
            height={170}
            className="relative translate-x-20"
          />
          <Image
            src={playerTwo?.player_imageUrl}
            alt=""
            width={170}
            height={170}
            className="relative translate-x-0"
          />
          <Image
            src={playerThree?.player_imageUrl}
            alt=""
            width={170}
            height={170}
            className="relative -translate-x-20"
          />
          <Image
            src={playerFour?.player_imageUrl}
            alt=""
            width={170}
            height={170}
            className="relative -translate-x-40"
          />
        </div>
      </div>
      <div className="flex h-full w-[30%] flex-col">
        <div className="flex h-[55%] items-center justify-center gap-2 p-1">
          {teamOne?.team_logoUrl && (
            <Image
              src={teamOne.team_logoUrl}
              alt="team logo"
              width={64}
              height={64}
            />
          )}
          <p className="text-[clamp(16px,20px,1.4rem)] font-bold">
            {teamOne.team_name}
          </p>

          {teamOne?.position == 1 && (
            <p className="text-3xl">
              <GiChickenOven />
            </p>
          )}
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
