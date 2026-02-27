import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Game = {
  id: string;
  home: string;
  away: string;
  priority?: string;
  market?: {
    spread?: string;
    total?: number;
  };
};

type SlateFile = {
  meta?: {
    date?: string;
  };
  games?: Game[];
};

export async function GET() {
  try {
    const home = process.env.HOME || process.env.USERPROFILE || "";
    const dir = path.join(
      home,
      "dojo",
      "projects",
      "ops-home",
      "data",
      "sports",
      "nba",
      "slates"
    );

    if (!fs.existsSync(dir)) {
      return NextResponse.json({ slates: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();

    const slates: SlateFile[] = files.map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return JSON.parse(raw);
    });

    return NextResponse.json({ slates });
  } catch (e) {
    console.error("nba-slates error", e);
    return NextResponse.json(
      { error: "failed to load NBA slates" },
      { status: 500 }
    );
  }
}
