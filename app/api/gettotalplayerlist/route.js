import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const isDebug = process.env.DEBUG === "true";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

const emptyPayload = { playerInfoList: [] };
const REQUEST_TIMEOUT_MS = 2500;

export async function GET() {
  if (isDebug) {
    const filePath = join(process.cwd(), "public", "playerData.json");
    const raw = readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    const players = Array.isArray(json?.TotalPlayerList)
      ? json.TotalPlayerList
      : Array.isArray(json?.playerInfoList)
        ? json.playerInfoList
        : [];
    return NextResponse.json(
      { playerInfoList: players },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!backendBaseUrl) {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${backendBaseUrl}/gettotalplayerlist`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(emptyPayload, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = await response.json();
    const players = Array.isArray(data?.playerInfoList)
      ? data.playerInfoList
      : Array.isArray(data?.TotalPlayerList)
        ? data.TotalPlayerList
        : [];

    return NextResponse.json(
      { playerInfoList: players },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
