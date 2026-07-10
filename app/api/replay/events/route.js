import { NextResponse } from "next/server";
import { getDefaultReplay } from "@/lib/replay/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getDefaultReplay(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load replay recording" },
      { status: 500 },
    );
  }
}
