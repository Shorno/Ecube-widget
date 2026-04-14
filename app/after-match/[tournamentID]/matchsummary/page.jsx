"use client";

import Layout from "@/components/layout";
import Title from "@/components/Title";
import { use, useRef } from "react"; // Added useRef
import gsap from "gsap"; // Added gsap
import { useGSAP } from "@gsap/react"; // Added useGSAP
import { useGetMatchSummaryQuery } from "@/lib/services/widget-api";
import { BiTargetLock } from "react-icons/bi";
import { FaHeartPulse } from "react-icons/fa6";
import { FaPersonFalling } from "react-icons/fa6";
import { GiGrenade } from "react-icons/gi";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaCarCrash } from "react-icons/fa";
import { cn } from "@/lib/utils";

function MatchSummary({ params }) {
  const { tournamentID } = use(params);
  const { data } = useGetMatchSummaryQuery({ tournamentID });
  const containerRef = useRef(null); // Create the scope reference

  useGSAP(
    () => {
      if (!data) return;

      gsap.set(".anim-title", { opacity: 0, y: -40 });
      // Start fully masked — clip wipes up from the bottom of each box's own boundary
      gsap.set(".anim-databox", { opacity: 1, clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Title drops from top — same pattern as all other pages
      tl.to(".anim-title", { opacity: 1, y: 0, duration: 1.0 })

        // 2. Databoxes wipe up — label marks this exact moment for count sync below
        .addLabel("wipeStart", "<0.2")
        .to(
          ".anim-databox",
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            stagger: { each: 0.1, from: "start" },
          },
          "wipeStart",
        );

      // ---- COUNT-UP: remove or comment out this block to disable ----
      const COUNT_END = 0.8;  // seconds after wipeStart when ALL counters finish
      const STAGGER   = 0.1;  // must match the wipe stagger above

      gsap.utils.toArray(".anim-count", containerRef.current).forEach((el, i) => {
        const target = parseFloat(el.dataset.value) || 0;
        const obj = { val: 0 };
        // Each box starts later but has a shorter duration so they all land together
        const duration = COUNT_END - i * STAGGER;
        tl.to(
          obj,
          {
            val: target,
            duration,
            ease: "power1.out", // linear-ish so numbers stay readable while rolling
            onUpdate: () => { el.textContent = Math.round(obj.val); },
          },
          `wipeStart+=${i * STAGGER}`,
        );
      });
      // ---- END COUNT-UP ----
    },
    { scope: containerRef, dependencies: [data] }
  );

  if (!data || !data.data) return null;

  return (
    <Layout top className="bg-transparent">
      {/* Wrap contents in a div to safely attach the ref. 
        This avoids needing forwardRef inside your Layout component. 
      */}
      <div ref={containerRef} className="h-full w-full">
        <div className="anim-title opacity-0">
          <Title title={"Match Summary"} data={data?.info} />
        </div>

        <div className="mx-auto mt-16 grid w-max grid-cols-3 gap-x-8 gap-y-16">
          <Databox
            title="Total Elims"
            value={data?.data?.total_kills}
            icon={<BiTargetLock />}
          />
          <Databox
            title="Total Heals"
            value={data?.data?.total_heals}
            icon={<FaHeartPulse />}
          />
          <Databox
            title="Total Knocks"
            value={data?.data?.total_knocks}
            icon={<FaPersonFalling />}
          />
          <Databox
            title="Grenade Elims"
            value={data?.data?.total_grenade_kills}
            icon={<GiGrenade />}
          />
          <Databox
            title="Total Assits"
            value={data?.data?.total_assists}
            icon={<FaHandshakeSimple />}
          />
          <Databox
            title="Vehical Elims"
            value={data?.data?.total_vehicle_kills}
            icon={<FaCarCrash />}
          />
        </div>
      </div>
    </Layout>
  );
}

export default MatchSummary;

// Your Databox is perfect as is!
const Databox = ({ title, value, icon, className = "anim-databox" }) => {
  return (
    // pt-5 matches the label's -top-5 overhang so the clip-path region includes it
    <div className={cn("pt-5", className)}>
    <div className="bg-primary-shade-two relative flex h-45 w-100">
      <div className="bg-primary-shade-one absolute -top-5 left-1/2 h-10 translate-x-[-50%] px-4 py-1 text-xl whitespace-nowrap uppercase">
        {title}
      </div>
      <div className="mx-auto flex w-[40%] items-center justify-center self-center text-center text-7xl">
        {icon}
      </div>
      <div className="bg-primary-shade-one grid h-[80%] w-[60%] place-content-center self-end">
        <p className="anim-count text-center text-5xl font-bold text-black" data-value={value}>0</p>
      </div>
    </div>
    </div>
  );
};
