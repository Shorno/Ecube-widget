import { NextResponse } from "next/server";
import { broadcastWidgetStatus } from "@/lib/sse/store";
import { str, strArray, validate } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const errors = validate({
    widgetUrl:    str(body.widgetUrl,    { min: 1, max: 500 }),
    failedImages: strArray(body.failedImages, { maxItems: 50, maxLen: 500 }),
  });
  if (errors) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const tournamentId = body.widgetUrl.split("/")[1] ?? "";
  broadcastWidgetStatus(tournamentId, body.widgetUrl, body.failedImages);
  return NextResponse.json({ ok: true });
}
