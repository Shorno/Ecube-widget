import { NextResponse } from "next/server";
import { broadcastWidgetStatus } from "@/lib/sse/store";
import { oneOf, str, strArray, validate } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseErrors = validate({
    widgetUrl: str(body.widgetUrl, { min: 1, max: 500 }),
    state: oneOf(body.state, ["error", "ready"]),
  });
  if (baseErrors)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const errorDetails =
    body.state === "error"
      ? validate({
          kind: oneOf(body.kind, ["image-load", "data-refresh"]),
          message: str(body.message, { min: 1, max: 300 }),
          details: strArray(body.details ?? [], {
            maxItems: 50,
            maxLen: 500,
          }),
        })
      : null;
  if (errorDetails)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const tournamentId = body.widgetUrl.split("/")[2] ?? "";
  const status =
    body.state === "ready"
      ? { widgetUrl: body.widgetUrl, state: "ready" }
      : {
          widgetUrl: body.widgetUrl,
          state: "error",
          kind: body.kind,
          message: body.message.trim(),
          details: body.details ?? [],
        };

  broadcastWidgetStatus(tournamentId, status);
  return NextResponse.json({ ok: true });
}
