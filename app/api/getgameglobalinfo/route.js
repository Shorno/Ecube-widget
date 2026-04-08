import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");
const DEBUG_ON = ["1", "true", "yes", "on"].includes(
  String(
    process.env.DEBUG ?? process.env.NEXT_PUBLIC_DEBUG ?? "",
  ).toLowerCase(),
);

const emptyPayload = {
  CircleArray: [],
  PlaneStartLocX: "0",
  PlaneStartLocY: "0",
  PlaneStopLocX: "0",
  PlaneStopLocY: "0",
};

const debugSafeCircle = {
  X: "278726.968750",
  Y: "236613.281250",
  Size: "254520.000000",
};

const debugPlane = {
  PlaneStartLocX: "199582.953125",
  PlaneStartLocY: "-124906.125000",
  PlaneStopLocX: "421954.062500",
  PlaneStopLocY: "968889.250000",
};

export async function GET() {
  if (DEBUG_ON) {
    return NextResponse.json(
      {
        gameGlobalInfo: {
          CircleArray: [debugSafeCircle],
          ...debugPlane,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!backendBaseUrl) {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${backendBaseUrl}/getgameglobalinfo`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(emptyPayload, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
