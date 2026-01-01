import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { fetchMultipleWalletBalances } from "@/lib/wallet-data";

// Cache for 10 minutes (600 seconds) - wallet data changes slower
export const revalidate = 600;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { addresses } = body;

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json(
        { error: "addresses array required" },
        { status: 400 }
      );
    }

    const balances = await fetchMultipleWalletBalances(addresses);

    return NextResponse.json({
      balances,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Wallet API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch wallet data",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "address parameter required" },
        { status: 400 }
      );
    }

    const balances = await fetchMultipleWalletBalances([address]);

    return NextResponse.json({
      balances,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Wallet API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch wallet data",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
