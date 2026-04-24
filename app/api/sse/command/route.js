import { NextResponse } from "next/server";
import { broadcast as broadcastV2 } from "@/lib/sse/store";
import { broadcast } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, label, userId, tournamentId } = body;

  if (url !== null && (typeof url !== "string" || !url.startsWith("/"))) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const resolvedLabel = url ? (label ?? url) : "Clear Screen";

  if (userId && tournamentId) {
    broadcastV2(userId, tournamentId, url, resolvedLabel);
  } else {
    broadcast(url, resolvedLabel);
  }

  return NextResponse.json({ ok: true, url });
}
