import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { str, validate } from "@/lib/validation";
import { invalidateUserCache } from "@/lib/db/queries";

const MAX_TOURNAMENTS = 50;

export async function POST(request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate({
    tournamentId: str(body.tournamentId, { min: 1, max: 100 }),
    tournamentName: str(body.tournamentName, { min: 1, max: 200 }),
  });
  if (errors)
    return NextResponse.json(
      { error: Object.values(errors)[0] },
      { status: 400 },
    );

  const tid = body.tournamentId.trim();
  const tname = body.tournamentName.trim();

  await connectDB();
  const user = await User.findById(session.userId, {
    allowedTournamentIds: 1,
  }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if ((user.allowedTournamentIds ?? []).includes(tid)) {
    return NextResponse.json(
      { error: "Tournament already added" },
      { status: 409 },
    );
  }
  if ((user.allowedTournamentIds ?? []).length >= MAX_TOURNAMENTS) {
    return NextResponse.json(
      { error: `Max ${MAX_TOURNAMENTS} tournaments allowed` },
      { status: 400 },
    );
  }

  await User.findByIdAndUpdate(session.userId, {
    $addToSet: { allowedTournamentIds: tid },
    $set: { [`tournamentNames.${tid}`]: tname },
  });
  invalidateUserCache(session.userId);
  return NextResponse.json({
    ok: true,
    tournamentId: tid,
    tournamentName: tname,
  });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate({
    tournamentId: str(body.tournamentId, { min: 1, max: 100 }),
  });
  if (errors)
    return NextResponse.json(
      { error: Object.values(errors)[0] },
      { status: 400 },
    );

  const tid = body.tournamentId.trim();

  await connectDB();
  await User.findByIdAndUpdate(session.userId, {
    $pull: { allowedTournamentIds: tid },
  });
  invalidateUserCache(session.userId);
  return NextResponse.json({ ok: true });
}
