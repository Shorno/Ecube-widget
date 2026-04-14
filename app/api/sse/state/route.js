import { NextResponse } from "next/server";
import { getCurrentState } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCurrentState());
}
