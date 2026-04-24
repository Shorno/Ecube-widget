import { NextResponse } from "next/server";
import { getCurrentState as getCurrentStateV2 } from "@/lib/sse/store";
import { getCurrentState } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId       = searchParams.get("userId");
  const tournamentId = searchParams.get("tournamentId");

  if (userId && tournamentId) {
    return NextResponse.json(getCurrentStateV2(userId, tournamentId));
  }

  return NextResponse.json(getCurrentState());
}
