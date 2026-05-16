import { NextResponse } from "next/server";
import { getCurrentState } from "@/lib/sse/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId") ?? "";
  return NextResponse.json(getCurrentState(tournamentId));
}
