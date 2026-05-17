import { NextResponse } from "next/server";
import { broadcast } from "@/lib/sse/store";
import { requireSession } from "@/lib/auth/session";
import { str, validate } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request) {
  await requireSession();

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { url, label, tournamentId } = body;

  // url: null = clear screen, "/" path, or external http(s) (Map overlay)
  if (url !== null && (
    typeof url !== "string" ||
    url.length > 500 ||
    (!url.startsWith("/") && !/^https?:\/\//i.test(url))
  )) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // In-game widget paths are not controllable via the controller
  if (url && /\/in-game\//i.test(url)) {
    return NextResponse.json({ error: "In-game widgets cannot be sent via the controller" }, { status: 403 });
  }

  const errors = validate({
    label:       str(label,       { max: 200, optional: true }),
    tournamentId: str(tournamentId, { max: 100, optional: true }),
  });
  if (errors) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });

  const resolvedLabel = url ? (label ?? url) : "Clear Screen";
  broadcast(tournamentId ?? "", url, resolvedLabel);
  return NextResponse.json({ ok: true, url });
}
