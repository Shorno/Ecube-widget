import { NextResponse } from "next/server";
import { getRecallReplay } from "@/lib/replay/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getRecallReplay(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load recall replay" },
      { status: 500 },
    );
  }
}
