// Etherscan wallet & blockchain data integration
// Free API with optional paid tier for higher limits

export interface WalletBalance {
  address: string;
  balance_eth: number;
  balance_usd?: number;
  last_updated: string;
}

export interface WalletData {
  address: string;
  balance: WalletBalance;
  recent_transactions?: number;
  token_holdings?: number;
}

/**
 * Fetch ETH balance from Etherscan API
 * Requires ETHERSCAN_API_KEY in environment
 * Free tier: 5 calls/sec, paid: 200 calls/sec
 */
export async function fetchWalletBalance(
  address: string,
  apiKey?: string
): Promise<WalletBalance | null> {
  if (!address) return null;

  try {
    const key = apiKey || process.env.ETHERSCAN_API_KEY;
    if (!key) {
      console.warn("Etherscan API key not configured");
      return null;
    }

    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${key}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "1") {
      console.warn("Etherscan error:", data.message);
      return null;
    }

    // Convert wei to ETH (1 ETH = 10^18 wei)
    const balanceWei = BigInt(data.result);
    const balanceEth = Number(balanceWei) / 1e18;

    return {
      address,
      balance_eth: balanceEth,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Wallet balance fetch error:", error);
    return null;
  }
}

/**
 * Fetch multiple wallet balances
 */
export async function fetchMultipleWalletBalances(
  addresses: string[],
  apiKey?: string
): Promise<Record<string, WalletBalance>> {
  const results: Record<string, WalletBalance> = {};

  // Etherscan free tier: 5 req/sec, so stagger requests
  for (const address of addresses) {
    const balance = await fetchWalletBalance(address, apiKey);
    if (balance) {
      results[address] = balance;
    }
    // Rate limit: 200ms delay between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
}

/**
 * Get transaction count (simple activity indicator)
 */
export async function fetchTransactionCount(
  address: string,
  apiKey?: string
): Promise<number | null> {
  if (!address) return null;

  try {
    const key = apiKey || process.env.ETHERSCAN_API_KEY;
    if (!key) return null;

    const url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${key}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.result?.length || 0;
  } catch (error) {
    console.error("Transaction count fetch error:", error);
    return null;
  }
}
