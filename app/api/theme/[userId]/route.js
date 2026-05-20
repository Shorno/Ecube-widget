import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { buildThemeJson } from "@/themes/catalog";

export async function GET(request, { params }) {
  const { userId } = await params;

  await connectDB();
  const user = await User.findById(userId, { themeConfig: 1 }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const json = buildThemeJson(
    user.themeConfig?.colors ?? {},
    user.themeConfig?.designVariant ?? "default",
  );

  return NextResponse.json(json);
}
