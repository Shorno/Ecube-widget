"use client";

import Layout from "@/components/common/Layout";
import WidgetStage from "@/components/common/WidgetStage";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMVP } from "@/hooks/widget-data";
import Image from "next/image";
import Title from "./_components/Title";
import MVPPlayerNameplate from "./_components/mvp-nameplate/MVPPlayerNameplate";

export default function MVPView({
  tournamentID,
  preview = false,
}: {
  tournamentID: string;
  preview?: boolean;
}) {
  const [stageReady, setStageReady] = useState(false);
  const { mvp, ready, info } = useMVP(tournamentID, { preview });
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageReady || !mvp) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      gsap.set(".anim-stat", { opacity: 0, y: 80 });
      gsap.set(".anim-player", { opacity: 0, x: 60 });

      const tl = gsap.timeline({ defaults: { ease: "circ.out" } });
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 0.5 })
        .to(".anim-player", { opacity: 1, x: 0, duration: 0.6 }, "<0.1")
        .to(
          ".anim-stat",
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "<0.15",
        );

      const COUNT_END = 0.8;
      const STAGGER = 0.08;
      gsap.utils
        .toArray<HTMLElement>(".anim-count", containerRef.current)
        .forEach((el, i) => {
          const target = parseFloat(el.dataset.value ?? "0") || 0;
          const padDigits = (el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0) || 4;
          const obj = { val: 0 };
          tl.to(
            obj,
            {
              val: target,
              duration: COUNT_END - i * STAGGER,
              ease: "power1.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.val)).padStart(
                  padDigits,
                  "0",
                );
              },
            },
            `<=`,
          );
        });
    },
    { scope: containerRef, dependencies: [stageReady, mvp] },
  );

  if (!ready) return null;

  return (
    <WidgetStage dataReady={ready} onReady={() => setStageReady(true)}>
      <Layout className="!p-0 bg-transparent w-[1920px] h-[1080px] relative overflow-hidden">
        <div
          ref={containerRef}
          className="absolute left-0 top-0 w-[1920px] h-[1080px]"
        >
          {/* Title Area */}
          <div
            className="anim-title pointer-events-none absolute left-[89px] top-[209px]"
          >
            <Title title="MATCH MVP" data={info} />
          </div>

          {/* Player Card Area */}
          <div className="anim-player absolute left-0 top-0 w-[1920px] h-[1080px] pointer-events-none">
            {/* Player Image (image 22) */}
            <div
              style={{
                position: "absolute",
                width: "493px",
                height: "740px",
                left: "1197px",
                top: "154px",
              }}
            >
              {mvp?.player_imageUrl && (
                <Image
                  src={mvp.player_imageUrl}
                  alt="Player Avatar"
                  fill
                  className="object-contain object-bottom"
                />
              )}
            </div>

            <MVPPlayerNameplate
              playerIgn={mvp?.player_ign}
              teamLogoUrl={mvp?.team_logoUrl}
              teamName={mvp?.team_name}
            />
          </div>

          {/* Box 1: ELIMINATIONS */}
          <div className="anim-stat absolute left-0 top-0 w-[1920px] h-[1080px] pointer-events-none">
            {/* Main box with dark green background */}
            <div
              className="bg-widget-primary-dark"
              style={{
                position: "absolute",
                width: "273px",
                height: "165px",
                left: "203px",
                top: "450px",
              }}
            >
              {/* Value Text */}
              <div
                className="anim-count"
                data-value={mvp?.kills || 0}
                data-pad={2}
                style={{
                  fontFamily: "var(--widget-font-primary)",
                  fontSize: "90px",
                  lineHeight: "165px",
                  textAlign: "center",
                  color: "var(--widget-text-3)",
                  width: "100%",
                  height: "100%",
                }}
              >
                {String(mvp?.kills || 0).padStart(2, "0")}
              </div>
            </div>

            {/* Header slant background */}
            <div
              style={{
                position: "absolute",
                width: "261px",
                height: "63px",
                left: "235px",
                top: "429px",
                background: "linear-gradient(var(--widget-gradient-angle, 90deg), var(--widget-gradient-from) 0%, var(--widget-gradient-to) 100%)",
                transform: "skewX(-14deg)",
              }}
            />

            {/* Header text */}
            <div
              style={{
                position: "absolute",
                width: "206px",
                height: "54px",
                left: "263px",
                top: "434px",
                fontFamily: "var(--widget-font-secondary)",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "45px",
                lineHeight: "54px",
                textAlign: "center",
                letterSpacing: "-0.01em",
                color: "var(--widget-text-3)",
              }}
            >
              ELIMINATIONS
            </div>

            {/* Icon Frame 1 (no background) */}
            <div
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                left: "84px",
                top: "474px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/head2head/target.svg"
                alt="Eliminations Icon"
                width={100}
                height={100}
                className="object-contain filter invert-0"
              />
            </div>
          </div>

          {/* Box 2: DAMAGES */}
          <div className="anim-stat absolute left-0 top-0 w-[1920px] h-[1080px] pointer-events-none">
            {/* Main box with dark green background */}
            <div
              className="bg-widget-primary-dark"
              style={{
                position: "absolute",
                width: "273px",
                height: "165px",
                left: "679px",
                top: "450px",
              }}
            >
              {/* Value Text */}
              <div
                className="anim-count"
                data-value={mvp?.damages || 0}
                data-pad={4}
                style={{
                  fontFamily: "var(--widget-font-primary)",
                  fontSize: "90px",
                  lineHeight: "165px",
                  textAlign: "center",
                  color: "var(--widget-text-3)",
                  width: "100%",
                  height: "100%",
                }}
              >
                {String(mvp?.damages || 0).padStart(4, "0")}
              </div>
            </div>

            {/* Header slant background */}
            <div
              style={{
                position: "absolute",
                width: "261px",
                height: "63px",
                left: "711px",
                top: "429px",
                background: "linear-gradient(var(--widget-gradient-angle, 90deg), var(--widget-gradient-from) 0%, var(--widget-gradient-to) 100%)",
                transform: "skewX(-14deg)",
              }}
            />

            {/* Header text */}
            <div
              style={{
                position: "absolute",
                width: "144px",
                height: "54px",
                left: "770px",
                top: "434px",
                fontFamily: "var(--widget-font-secondary)",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "45px",
                lineHeight: "54px",
                textAlign: "center",
                letterSpacing: "-0.01em",
                color: "var(--widget-text-3)",
              }}
            >
              DAMAGES
            </div>

            {/* Icon Group 8 (no background, floating) */}
            <div
              style={{
                position: "absolute",
                width: "151.56px",
                height: "151.56px",
                left: "514px",
                top: "457px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/head2head/helmet.svg"
                alt="Damages Icon"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* Box 3: KNOCKOUTS */}
          <div className="anim-stat absolute left-0 top-0 w-[1920px] h-[1080px] pointer-events-none">
            {/* Main box with dark green background */}
            <div
              className="bg-widget-primary-dark"
              style={{
                position: "absolute",
                width: "273px",
                height: "165px",
                left: "229px",
                top: "729px",
              }}
            >
              {/* Value Text */}
              <div
                className="anim-count"
                data-value={mvp?.knocks || 0}
                data-pad={2}
                style={{
                  fontFamily: "var(--widget-font-primary)",
                  fontSize: "90px",
                  lineHeight: "165px",
                  textAlign: "center",
                  color: "var(--widget-text-3)",
                  width: "100%",
                  height: "100%",
                }}
              >
                {String(mvp?.knocks || 0).padStart(2, "0")}
              </div>
            </div>

            {/* Header slant background */}
            <div
              style={{
                position: "absolute",
                width: "261px",
                height: "63px",
                left: "261px",
                top: "708px",
                background: "linear-gradient(var(--widget-gradient-angle, 90deg), var(--widget-gradient-from) 0%, var(--widget-gradient-to) 100%)",
                transform: "skewX(-14deg)",
              }}
            />

            {/* Header text */}
            <div
              style={{
                position: "absolute",
                width: "181px",
                height: "54px",
                left: "302px",
                top: "713px",
                fontFamily: "var(--widget-font-secondary)",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "45px",
                lineHeight: "54px",
                textAlign: "center",
                letterSpacing: "-0.01em",
                color: "var(--widget-text-3)",
              }}
            >
              KNOCKOUTS
            </div>

            {/* Icon Group 7 (no background, floating) */}
            <div
              style={{
                position: "absolute",
                width: "154px",
                height: "104.34px",
                left: "62px",
                top: "758px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/head2head/knock-out.svg"
                alt="Knockouts Icon"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* Box 4: HEALINGS */}
          <div className="anim-stat absolute left-0 top-0 w-[1920px] h-[1080px] pointer-events-none">
            {/* Main box with dark green background */}
            <div
              className="bg-widget-primary-dark"
              style={{
                position: "absolute",
                width: "273px",
                height: "165px",
                left: "679px",
                top: "729px",
              }}
            >
              {/* Value Text */}
              <div
                className="anim-count"
                data-value={mvp?.heals || 0}
                data-pad={4}
                style={{
                  fontFamily: "var(--widget-font-primary)",
                  fontSize: "90px",
                  lineHeight: "165px",
                  textAlign: "center",
                  color: "var(--widget-text-3)",
                  width: "100%",
                  height: "100%",
                }}
              >
                {String(mvp?.heals || 0).padStart(4, "0")}
              </div>
            </div>

            {/* Header slant background */}
            <div
              style={{
                position: "absolute",
                width: "261px",
                height: "63px",
                left: "711px",
                top: "708px",
                background: "linear-gradient(var(--widget-gradient-angle, 90deg), var(--widget-gradient-from) 0%, var(--widget-gradient-to) 100%)",
                transform: "skewX(-14deg)",
              }}
            />

            {/* Header text */}
            <div
              style={{
                position: "absolute",
                width: "146px",
                height: "54px",
                left: "769px",
                top: "713px",
                fontFamily: "var(--widget-font-secondary)",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "45px",
                lineHeight: "54px",
                textAlign: "center",
                letterSpacing: "-0.01em",
                color: "var(--widget-text-3)",
              }}
            >
              HEALINGS
            </div>

            {/* Icon Group 5 (no background, floating) */}
            <div
              style={{
                position: "absolute",
                width: "122.76px",
                height: "112.66px",
                left: "529px",
                top: "756px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/head2head/heal.svg"
                alt="Healings Icon"
                width={90}
                height={90}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Layout>
    </WidgetStage>
  );
}


