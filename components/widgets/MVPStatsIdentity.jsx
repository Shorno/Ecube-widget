import Image from "next/image";

const MVPStatsIdentity = ({ mvp, isGroup = false }) => {
  return (
    <div className="absolute bottom-48 left-0">
      <div className="absolute bottom-48 ml-4 flex flex-col items-start">
        <p className="text-primary anim-bg-text -mb-4 ml-8 text-[92px] leading-none font-bold uppercase opacity-0">
          {isGroup ? "OVERALL" : "MATCH"}
        </p>
        <p className="stroked-text anim-bg-text text-[500px] leading-[0.8] font-extrabold text-white opacity-0">
          MVP
        </p>
      </div>
      <div className="bg-primary anim-identity-box z-30 flex w-100 opacity-0">
        <div className="grid place-content-center py-2">
          <div className="bg-primary-shade-two">
            <Image
              priority
              src={mvp?.team_logoUrl}
              alt=""
              width={120}
              height={120}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="bg-primary-shade-one p-2 text-center text-3xl text-white">
            {mvp?.team_name}
          </div>
          <div className="bg-primary-shade-two p-2 text-center text-5xl text-black">
            {mvp?.player_ign}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPStatsIdentity;
