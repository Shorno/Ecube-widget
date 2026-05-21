import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { str, strObj, oneOf, validate } from "@/lib/validation";
import { WIDGET_FONTS } from "@/themes/catalog";
import { trackRequest } from "@/lib/metrics/track";
import { invalidateUserCache } from "@/lib/db/queries";

const FONT_KEYS = WIDGET_FONTS.map((f) => f.key);

const HEX_RE = /^#[0-9a-f]{6}$/i;
const RGBA_RE = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/;

// Normalize a single color value: hex → rgba, reject anything else invalid.
function normalizeColor(val) {
  if (typeof val !== "string") return null;
  const v = val.trim();
  if (HEX_RE.test(v)) {
    const r = parseInt(v.slice(1, 3), 16);
    const g = parseInt(v.slice(3, 5), 16);
    const b = parseInt(v.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  // gradientAngle is stored as "135deg" — pass through non-color strings
  if (RGBA_RE.test(v)) return v;
  // Allow angle values like "135deg" and other non-color tokens
  return v;
}

// Recursively normalize all color values in a colors object.
function normalizeColors(obj) {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, normalizeColor(v)]),
  );
}

export async function GET(request) {
  trackRequest(request, "/api/user/settings", "GET");
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.userId, {
    "themeConfig.designVariant": 1,
    "themeConfig.font": 1,
    "themeConfig.colors": 1,
    allowedDesignIds: 1,
    allowedTournamentIds: 1,
    tournamentDesigns: 1,
  }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    themeConfig: user.themeConfig ?? {},
    allowedDesignIds: user.allowedDesignIds ?? ["default"],
    allowedTournamentIds: user.allowedTournamentIds ?? [],
    tournamentDesigns: user.tournamentDesigns ?? {},
  });
}

export async function PUT(request) {
  trackRequest(request, "/api/user/settings", "PUT");
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Fetch user's allowed designs for designVariant validation
  await connectDB();
  const user = await User.findById(session.userId, {
    allowedDesignIds: 1,
  }).lean();
  const allowedDesigns = user?.allowedDesignIds ?? ["default"];

  const checks = {};
  if (body.designVariant !== undefined)
    checks.designVariant = oneOf(body.designVariant, allowedDesigns);
  if (body.font !== undefined) checks.font = oneOf(body.font, FONT_KEYS);
  if (body.fontSecondary !== undefined)
    checks.fontSecondary = oneOf(body.fontSecondary, FONT_KEYS);
  if (body.tournamentDesigns !== undefined)
    checks.tournamentDesigns = strObj(body.tournamentDesigns, {
      maxKeys: 200,
      maxValLen: 100,
    });
  if (body.tournamentFonts !== undefined)
    checks.tournamentFonts = strObj(body.tournamentFonts, {
      maxKeys: 200,
      maxValLen: 100,
    });
  // colors: loose validation — just check it's an object (nested structure is complex)
  if (
    body.colors !== undefined &&
    (typeof body.colors !== "object" || Array.isArray(body.colors))
  ) {
    checks.colors = "Must be an object";
  }

  const errors = validate(checks);
  if (errors)
    return NextResponse.json(
      { error: Object.values(errors)[0], fields: errors },
      { status: 400 },
    );

  const $set = {};
  if (body.colors !== undefined) {
    $set["themeConfig.colors"] = normalizeColors(body.colors);
    // Record which design these colors belong to so settings page can detect design switches.
    if (body.designVariant !== undefined)
      $set["themeConfig.colorDesignVariant"] = body.designVariant;
  }
  if (body.designVariant !== undefined)
    $set["themeConfig.designVariant"] = body.designVariant;
  if (body.font !== undefined) $set["themeConfig.font"] = body.font;
  if (body.fontSecondary !== undefined)
    $set["themeConfig.fontSecondary"] = body.fontSecondary;
  if (body.tournamentDesigns !== undefined)
    $set.tournamentDesigns = body.tournamentDesigns;
  if (body.tournamentColors !== undefined)
    $set.tournamentColors = normalizeColors(body.tournamentColors);
  if (body.tournamentFonts !== undefined)
    $set.tournamentFonts = body.tournamentFonts;
  if (body.tournamentSecondaryFonts !== undefined)
    $set.tournamentSecondaryFonts = body.tournamentSecondaryFonts;

  if (body.tournamentDesignColors !== undefined) {
    // Normalize nested structure: { tid: { design: colorObj } }
    const tdc = body.tournamentDesignColors;
    $set.tournamentDesignColors =
      tdc && typeof tdc === "object"
        ? Object.fromEntries(
            Object.entries(tdc).map(([tid, designs]) => [
              tid,
              designs && typeof designs === "object"
                ? Object.fromEntries(
                    Object.entries(designs).map(([design, colors]) => [
                      design,
                      normalizeColors(colors),
                    ]),
                  )
                : designs,
            ]),
          )
        : tdc;
  }

  if (Object.keys($set).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await User.findByIdAndUpdate(session.userId, { $set });
  invalidateUserCache(session.userId);
  return NextResponse.json({ ok: true });
}
