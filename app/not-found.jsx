import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-950 px-6 text-center">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow behind the 404 */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(165,78,38,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Status pill */}
      <div className="mb-8 flex items-center gap-2 border border-red-800/60 bg-red-950/40 px-4 py-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-xs font-bold tracking-[0.25em] text-red-400 uppercase">
          Player Eliminated
        </span>
      </div>

      {/* 404 */}
      <h1
        className="text-[clamp(120px,22vw,220px)] leading-none font-black tracking-tighter text-white select-none"
        style={{ fontFamily: "var(--font-oswald), 'Agency FB', sans-serif" }}
      >
        <span style={{ color: "var(--primary, #a54e26)" }}>4</span>
        <span className="opacity-20">0</span>
        <span style={{ color: "var(--primary, #a54e26)" }}>4</span>
      </h1>

      {/* Label */}
      <p className="mt-2 text-xs font-bold tracking-[0.35em] text-gray-500 uppercase">
        Out of Bounds
      </p>

      {/* Divider */}
      <div
        className="my-8 h-px w-24"
        style={{ background: "var(--primary-shade-one, #008e88)" }}
      />

      {/* Message */}
      <p className="max-w-xs text-sm leading-relaxed text-gray-400">
        You wandered outside the safe zone. This page doesn&apos;t exist or has
        been moved.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="mt-10 inline-block border px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:opacity-80"
        style={{
          borderColor: "var(--primary, #a54e26)",
          background: "rgba(165,78,38,0.15)",
        }}
      >
        Return to Base
      </Link>

      {/* Bottom identifier */}
      <p className="absolute bottom-6 text-xs tracking-widest text-gray-700 uppercase">
        Effinity · Widget Platform
      </p>
    </div>
  );
}
