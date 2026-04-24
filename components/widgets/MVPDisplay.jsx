import Image from "next/image";
import { BiTargetLock } from "react-icons/bi";
import { GiSilverBullet } from "react-icons/gi";
import { FaPersonFalling } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import Layout from "@/components/common/Layout";
import MVPStats from "./MVPStats";
import MVPStatsIdentity from "./MVPStatsIdentity";
import { GiCrossedPistols } from "react-icons/gi";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MVPDisplay = ({ mvp, isGroup = false, stageReady = false }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!mvp || !stageReady) return;

      // gsap.set() is synchronous — applies instantly with no RAF frame delay.
      // This pre-positions every element at its starting state before the first
      // paint, so there's zero flash of the final position.
      // Option B: character enters first (fully opaque, no opacity animation),
      // then text and stats reveal around it. This prevents bg-text bleeding
      // through a semi-transparent character — character is always at opacity:1.
      gsap.set(".anim-bg-text", { zIndex: 1, opacity: 0, scale: 1.05 });
      // opacity: 1 — Layout's overflow-hidden hides it at y:200 until it slides up.
      gsap.set(".anim-character", { zIndex: 50, opacity: 1, y: 200, scale: 0.85 });
      gsap.set(".anim-identity-box", { x: -50, opacity: 0 });
      gsap.set(".anim-MVPStats", { y: 40, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Character enters first — slides up and grows into position
      tl.to(".anim-character", {
        y: 0,
        scale: 1,
        duration: 1.2,
      })

        // 2. Background Text starts partway through character's slide
        .to(
          ".anim-bg-text",
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            stagger: 0.15,
          },
          "<0.1", // <-- Tweak here (starts 0.1s into character's 1.2s slide)
        )

        // 3. Identity Box starts shortly after bg-text
        .to(
          ".anim-identity-box",
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
          },
          "<0.1", // <-- Tweak here
        )

        // 4. Stats Boxes start at the exact SAME TIME as the Identity Box
        .to(
          ".anim-MVPStats",
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: {
              each: 0.1,
              from: "start",
            },
          },
          "<", // <-- Tweak here
        );
    },
    { scope: containerRef, dependencies: [mvp, stageReady] },
  );

  return (
    <Layout className={"relative"}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full">
        {/* identity */}
        <MVPStatsIdentity mvp={mvp} isGroup={isGroup} />

        <Image
          priority
          className="anim-character absolute bottom-0 left-1/2 z-20 -translate-x-1/2 opacity-0"
          src={mvp?.player_imageUrl}
          alt=""
          width={600}
          height={600}
        />
        {/* player stats */}
        <div className="absolute right-6 bottom-16 flex flex-col gap-2">
          <MVPStats
            className="anim-MVPStats opacity-0"
            label={isGroup ? "Total Eliminations" : "Eliminations"}
            value={mvp?.kills}
            icon={<BiTargetLock />}
          />
          <MVPStats
            className="anim-MVPStats opacity-0"
            label={isGroup ? "Total Damage" : "Damage"}
            value={mvp?.damages}
            icon={<GiSilverBullet />}
          />
          <MVPStats
            className="anim-MVPStats opacity-0"
            label={isGroup ? "Total Knocks" : "Knocks"}
            value={mvp?.knocks}
            icon={<FaPersonFalling />}
          />
          <MVPStats
            className="anim-MVPStats opacity-0"
            label={isGroup ? "Matches Played" : "Survival Time"}
            value={
              isGroup ? mvp?.match_played : mvp?.survival_time_display?.text
            }
            icon={isGroup ? <GiCrossedPistols /> : <GiSandsOfTime />}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MVPDisplay;
