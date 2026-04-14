import Image from "next/image";
import { BiTargetLock } from "react-icons/bi";
import { GiSilverBullet } from "react-icons/gi";
import { FaPersonFalling } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import Layout from "./layout";
import MVPStats from "./MVPStats";
import MVPStatsIdentity from "./MVPStatsIdentity";
import { GiCrossedPistols } from "react-icons/gi";

const MVPPage = ({ mvp, isGroup = false }) => {
  return (
    <Layout className={"relative"}>
      <Image
        priority
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2"
        src={mvp?.player_imageUrl}
        alt=""
        width={600}
        height={600}
      />
      {/* player stats */}
      <div className="absolute right-6 bottom-16 flex flex-col gap-2">
        <MVPStats
          label={isGroup ? "Total Eliminations" : "Eliminations"}
          value={mvp?.kills}
          icon={<BiTargetLock />}
        />
        <MVPStats
          label={isGroup ? "Total Damage" : "Damage"}
          value={mvp?.damages}
          icon={<GiSilverBullet />}
        />
        <MVPStats
          label={isGroup ? "Total Knocks" : "Knocks"}
          value={mvp?.knocks}
          icon={<FaPersonFalling />}
        />
        <MVPStats
          label={isGroup ? "Matches Played" : "Survival Time"}
          value={isGroup ? mvp?.match_played : mvp?.survival_time_display?.text}
          icon={isGroup ? <GiCrossedPistols /> : <GiSandsOfTime />}
        />
      </div>

      {/* identity */}
      <MVPStatsIdentity mvp={mvp} isGroup={isGroup} />
    </Layout>
  );
};

export default MVPPage;
