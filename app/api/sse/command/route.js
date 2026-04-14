import { NextResponse } from "next/server";
import { broadcast } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, label } = body;

  // url === null means clear screen; otherwise must be a relative path
  if (url !== null && (typeof url !== "string" || !url.startsWith("/"))) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  broadcast(url, url ? (label ?? url) : "Clear Screen");

  return NextResponse.json({ ok: true, url });
}
