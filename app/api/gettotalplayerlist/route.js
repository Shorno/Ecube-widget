import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

const emptyPayload = { playerInfoList: [] };
const REQUEST_TIMEOUT_MS = 2500;
const DEBUG_ON = ["1", "true", "yes", "on"].includes(
  String(
    process.env.DEBUG ?? process.env.NEXT_PUBLIC_DEBUG ?? "",
  ).toLowerCase(),
);

const normalizePlayers = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.playerInfoList)
      ? data.playerInfoList
      : Array.isArray(data?.TotalPlayerList)
        ? data.TotalPlayerList
        : [];

export async function GET() {
  if (DEBUG_ON) {
    try {
      const filePath = path.join(process.cwd(), "public", "playerData.json");
      const raw = await readFile(filePath, "utf8");
      const data = JSON.parse(raw);
      return NextResponse.json(
        { playerInfoList: normalizePlayers(data) },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return NextResponse.json(emptyPayload, {
        headers: { "Cache-Control": "no-store" },
      });
    }
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
    const players = normalizePlayers(data);

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
