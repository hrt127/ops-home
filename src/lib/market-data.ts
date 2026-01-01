// CoinGecko market data integration
// Free API, no authentication required

export interface MarketPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  last_updated?: string;
}

export interface MarketData {
  prices: Record<string, MarketPrice>;
  timestamp: string;
  source: "coingecko";
}

/**
 * Fetch current prices from CoinGecko API (free, no auth)
 * Returns prices for BTC, ETH, and other major tokens
 */
export async function fetchMarketPrices(): Promise<MarketData> {
  try {
    const ids = "bitcoin,ethereum,cardano,solana,polkadot";
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

    const response = await fetch(url, {
      // CoinGecko limits free API to 10-50 requests per minute
      // Production should use paid tier or caching
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform flat API response to structured format
    const prices: Record<string, MarketPrice> = {};

    const mapping: Record<string, { symbol: string; name: string }> = {
      bitcoin: { symbol: "BTC", name: "Bitcoin" },
      ethereum: { symbol: "ETH", name: "Ethereum" },
      cardano: { symbol: "ADA", name: "Cardano" },
      solana: { symbol: "SOL", name: "Solana" },
      polkadot: { symbol: "DOT", name: "Polkadot" },
    };

    Object.entries(data).forEach(([id, priceData]: [string, any]) => {
      const info = mapping[id] || { symbol: id.toUpperCase(), name: id };
      prices[id] = {
        id,
        symbol: info.symbol,
        name: info.name,
        current_price: priceData.usd || 0,
        market_cap_change_24h: priceData.usd_market_cap_change_24h,
        price_change_percentage_24h: priceData.usd_24h_change,
        market_cap: priceData.usd_market_cap,
        last_updated: new Date().toISOString(),
      };
    });

    return {
      prices,
      timestamp: new Date().toISOString(),
      source: "coingecko",
    };
  } catch (error) {
    console.error("Market data fetch error:", error);
    throw error;
  }
}

/**
 * Get prices with fallback and caching
 */
export async function getMarketData(
  fallback?: MarketData
): Promise<MarketData> {
  try {
    return await fetchMarketPrices();
  } catch (error) {
    console.warn("Failed to fetch market prices, using fallback:", error);
    if (fallback) return fallback;

    // Return placeholder if no fallback
    return {
      prices: {
        bitcoin: {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 0,
          last_updated: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
      source: "coingecko",
    };
  }
}
