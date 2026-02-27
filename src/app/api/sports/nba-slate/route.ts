import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const home = process.env.HOME || process.env.USERPROFILE || "";
    const slatePath = path.join(
      home,
      "dojo",
      "projects",
      "ops-home",
      "data",
      "sports",
      "nba",
      "slates",
      "2026-02-07.json"
    );

    const raw = fs.readFileSync(slatePath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json(data);
  } catch (e) {
    console.error("nba-slate error", e);
    return NextResponse.json(
      { error: "failed to load NBA slate" },
      { status: 500 }
    );
  }
}
