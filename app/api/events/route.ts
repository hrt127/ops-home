import { NextRequest, NextResponse } from "next/server";

// Minimal rate limit stub
let lastRequest = 0;
export async function POST(req: NextRequest) {
  const now = Date.now();
  if (now - lastRequest < 1000) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  lastRequest = now;
  // ...existing code...
}
import { NextResponse } from "next/server";
import { events } from "@/lib/events";

export async function GET() {
  return NextResponse.json({ events });
}
