import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

const emptyPayload = {
  CircleArray: [],
  PlaneStartLocX: "0",
  PlaneStartLocY: "0",
  PlaneStopLocX: "0",
  PlaneStopLocY: "0",
};

export async function GET() {
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
