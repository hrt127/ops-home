import React, { useEffect, useState } from "react";
import { getMarketStrip, updateMarketPairs } from "../lib/api-client";

export default function MarketStrip() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pairsInput, setPairsInput] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMarketStrip();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const startEdit = () => {
    setPairsInput(items.map(i => i.pair).join(", "));
    setEditing(true);
  };

  const saveEdit = async () => {
    const newPairs = pairsInput.split(",").map(p => p.trim()).filter(Boolean);
    setEditing(false);
    // Optimistic ? No, just reload
    try {
      await updateMarketPairs(newPairs);
      setTimeout(load, 500);
    } catch (e) {
      console.error(e);
    }
  };

  const formatPrice = (price: string) => {
    const p = parseFloat(price);
    if (!p) return price;
    return p > 100 ? p.toFixed(2) : p.toFixed(4);
  };

  const formatChange = (change: string) => {
    const c = parseFloat(change);
    if (!c) return "—";
    const sign = c > 0 ? "+" : "";
    return `${sign}${c.toFixed(2)}%`;
  };

  const changeColor = (change: string) => {
    const c = parseFloat(change);
    if (!c) return "text-zinc-400";
    return c > 0 ? "text-emerald-400" : "text-rose-400";
  };

  if (editing) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] flex gap-2 items-center">
        <span className="text-zinc-400">Pairs:</span>
        <input
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-0.5 text-zinc-100"
          value={pairsInput}
          onChange={e => setPairsInput(e.target.value)}
          placeholder="BTC-USDT, ETH-USDT..."
        />
        <button onClick={saveEdit} className="text-sky-400 hover:text-sky-300">Save</button>
        <button onClick={() => setEditing(false)} className="text-zinc-500">Cancel</button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] flex justify-between items-center">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        <span className="text-zinc-400 font-semibold cursor-pointer hover:text-zinc-200" onClick={startEdit} title="Click to edit pairs">Market:</span>
        {items.map((item) => (
          <div key={item.pair} className="flex flex-col gap-0.5 min-w-[60px]">
            <span className="text-sky-300 font-medium">
              {item.pair.split('-')[0]} <span className="text-zinc-500 text-[9px]">${formatPrice(item.price)}</span>
            </span>
            <div className="flex justify-between w-full">
              <span className={`text-[9px] ${changeColor(item.change24h)}`}>
                {formatChange(item.change24h)}
              </span>
              <span className="text-[9px] text-zinc-600">
                {(parseFloat(item.fundingRate) * 100).toFixed(4)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-zinc-600">
        <span>{loading ? "..." : "●"}</span>
      </div>
    </div>
  );
}
