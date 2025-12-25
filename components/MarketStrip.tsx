import React, { useEffect, useState } from "react";

interface PriceData {
  BTC?: number;
  ETH?: number;
  btcChange?: number;
  ethChange?: number;
}

export default function MarketStrip() {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/market");
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();

        setPrices({
          BTC: data.prices?.bitcoin?.current_price || 0,
          ETH: data.prices?.ethereum?.current_price || 0,
          btcChange: data.prices?.bitcoin?.price_change_percentage_24h || 0,
          ethChange: data.prices?.ethereum?.price_change_percentage_24h || 0,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load prices");
        // Fallback: show placeholder
        setPrices({
          BTC: 0,
          ETH: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return "—";
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const formatChange = (change: number | undefined) => {
    if (!change) return "—";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const changeColor = (change: number | undefined) => {
    if (!change) return "text-zinc-400";
    return change > 0 ? "text-emerald-400" : "text-rose-400";
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] flex justify-between items-center">
      <div className="flex gap-4">
        <span className="text-zinc-400">Market:</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-300">
            BTC {formatPrice(prices.BTC || 0)}
          </span>
          <span className={`text-[10px] ${changeColor(prices.btcChange)}`}>
            {formatChange(prices.btcChange)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sky-300">
            ETH {formatPrice(prices.ETH || 0)}
          </span>
          <span className={`text-[10px] ${changeColor(prices.ethChange)}`}>
            {formatChange(prices.ethChange)}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-zinc-400">
        <span>Last update: {loading ? "..." : "live"}</span>
      </div>
    </div>
  );
}
