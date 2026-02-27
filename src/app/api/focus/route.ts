import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const focusPath = path.join(os.homedir(), "dojo", "system", "FOCUS.json");

export type FocusData = {
    mode: "DOING" | "LEARNING" | "REVIEWING" | "IDLE";
    project: string | null;
    topic: string | null;
    path: string | null;
    updated_at: string | null;
};

const IDLE_FOCUS: FocusData = {
    mode: "IDLE",
    project: null,
    topic: null,
    path: null,
    updated_at: null,
};

export async function GET() {
    try {
        const raw = fs.readFileSync(focusPath, "utf-8");
        const data = JSON.parse(raw) as FocusData;
        return NextResponse.json(data);
    } catch {
        // FOCUS.json missing or unreadable — return safe IDLE default
        return NextResponse.json(IDLE_FOCUS, { status: 200 });
    }
}
