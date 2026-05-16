import { NextResponse } from "next/server";
import { broadcast } from "@/lib/sse/store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, label, tournamentId } = body;

  if (url !== null && (typeof url !== "string" || !url.startsWith("/"))) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const resolvedLabel = url ? (label ?? url) : "Clear Screen";
  broadcast(tournamentId ?? "", url, resolvedLabel);

  return NextResponse.json({ ok: true, url });
}
