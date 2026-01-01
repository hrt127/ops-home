import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { getMarketData } from "@/lib/market-data";

// Cache for 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    const data = await getMarketData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Market API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
