import { NextResponse } from "next/server";
import { after } from "next/server";
import { broadcast } from "@/lib/sse/store";
import { requireSession } from "@/lib/auth/session";
import { getUserTournaments } from "@/lib/db/queries";
import { str, validate } from "@/lib/validation";
import { logSSECommand, flushLogs } from "@/lib/metrics/logger";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const start =
    parseInt(request.headers.get("x-req-start") ?? "0", 10) || Date.now();

  const session = await requireSession();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, label, tournamentId } = body;

  if (
    url !== null &&
    (typeof url !== "string" ||
      url.length > 500 ||
      (!url.startsWith("/") && !/^https?:\/\//i.test(url)))
  ) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (url && /\/in-game\//i.test(url)) {
    return NextResponse.json(
      { error: "In-game widgets cannot be sent via the controller" },
      { status: 403 },
    );
  }

  const errors = validate({
    label: str(label, { max: 200, optional: true }),
    tournamentId: str(tournamentId, { max: 100, optional: true }),
  });
  if (errors)
    return NextResponse.json(
      { error: Object.values(errors)[0] },
      { status: 400 },
    );

  // Admins can command any tournament; regular users are restricted to their own.
  if (session.role !== "admin" && tournamentId) {
    const allowed = await getUserTournaments(session.userId);
    if (!allowed.includes(tournamentId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const resolvedLabel = url ? (label ?? url) : "Clear Screen";

  // Measure only the broadcast itself to isolate SSE delivery time
  const broadcastStart = Date.now();
  broadcast(tournamentId ?? "", url, resolvedLabel);
  const broadcastMs = Date.now() - broadcastStart;

  const totalMs = Date.now() - start;

  after(async () => {
    logSSECommand({
      tournamentId,
      url,
      label: resolvedLabel,
      durationMs: totalMs,
      broadcastMs,
    });
    await flushLogs();
  });

  return NextResponse.json({ ok: true, url, durationMs: totalMs });
}
