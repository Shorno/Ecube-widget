import { NextResponse } from "next/server";
import { broadcastWidgetStatus } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { widgetUrl, failedImages } = body;

  if (!widgetUrl || !Array.isArray(failedImages)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  broadcastWidgetStatus(widgetUrl, failedImages);

  return NextResponse.json({ ok: true });
}
