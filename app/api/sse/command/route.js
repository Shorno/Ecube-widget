import { NextResponse } from "next/server";
import { after } from "next/server";
import { broadcast, broadcastMatchStart } from "@/lib/sse/store";
import { requireSession } from "@/lib/auth/session";
import { getUserTournaments } from "@/lib/db/queries";
import { str, validate } from "@/lib/validation";
import { logSSECommand, flushLogs } from "@/lib/metrics/logger";

export const dynamic = "force-dynamic";

function isLocalMatchStartUrl(url, tournamentId) {
  if (typeof url !== "string" || !url.startsWith("/")) return false;
  if (!tournamentId) return false;

  let pathname;
  try {
    pathname = new URL(url, "http://ecube.local").pathname;
  } catch {
    return false;
  }

  const parts = pathname.split("/").filter(Boolean);
  return (
    parts.length === 4 &&
    parts[1] === tournamentId &&
    parts[2] === "pre-game" &&
    parts[3] === "match-start"
  );
}

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

  const normalizedTournamentId =
    typeof tournamentId === "string" ? tournamentId.trim() : "";
  const isMatchStartUrl = isLocalMatchStartUrl(url, normalizedTournamentId);
  const target = isMatchStartUrl ? "match-start" : (body.target ?? "display");

  if (target !== "display" && target !== "match-start") {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  if (target === "match-start" && !isMatchStartUrl) {
    return NextResponse.json(
      { error: "Match Start target requires the local match-start URL" },
      { status: 400 },
    );
  }

  // Admins can command any tournament; regular users are restricted to their own.
  if (session.role !== "admin" && normalizedTournamentId) {
    const allowed = await getUserTournaments(session.userId);
    if (!allowed.includes(normalizedTournamentId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const resolvedLabel = url ? (label ?? url) : "Clear Screen";

  // Measure only the broadcast itself to isolate SSE delivery time
  const broadcastStart = Date.now();
  if (target === "match-start") {
    broadcastMatchStart(normalizedTournamentId, url, resolvedLabel);
  } else {
    broadcast(tournamentId ?? "", url, resolvedLabel);
  }
  const broadcastMs = Date.now() - broadcastStart;

  const totalMs = Date.now() - start;

  after(async () => {
    logSSECommand({
      tournamentId,
      url,
      label: resolvedLabel,
      target,
      durationMs: totalMs,
      broadcastMs,
    });
    await flushLogs();
  });

  return NextResponse.json({ ok: true, url, target, durationMs: totalMs });
}
