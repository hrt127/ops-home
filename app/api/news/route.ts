import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { fetchCryptoNews } from "@/lib/news-data";

// Cache for 30 minutes (1800 seconds) - news doesn't change as fast
export const revalidate = 1800;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "bitcoin ethereum";
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);

    const data = await fetchCryptoNews(query, limit);

    if (!data) {
      return NextResponse.json(
        { error: "News API not configured or failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("News API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
