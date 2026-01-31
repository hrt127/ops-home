
import React, { useEffect, useState } from "react";
import { getWallets, updateWallet, addWallet } from "../lib/api-client";

export default function WalletLanes(props: any) {
  const { wallets, onChange, selected, onSelect } = props;
  // Defensive normalization: handle various states of "wallets"
  // 1. undefined/null -> []
  // 2. Array -> keep as is
  // 3. Object with "wallets" property -> extract it
  const walletList = Array.isArray(wallets)
    ? wallets
    : (wallets as any)?.wallets
      ? (wallets as any).wallets
      : [];

  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // Background sync on mount
  useEffect(() => {
    setLoading(true);
    getWallets()
      .then((data: any) => {
        // API might return { wallets: [...] } or just [...]
        const normalized = Array.isArray(data) ? data : data?.wallets || [];
        onChange(normalized);
      })
      .finally(() => setLoading(false));
  }, []); // Only mount

  const updateWalletField = async (id: string, patch: any) => {
    // Optimistic update
    const prev = walletList;
    const updatedWallets = walletList.map((w: any) => (w.id === id ? { ...w, ...patch } : w));
    onChange(updatedWallets);

    // Find the full updated wallet object to send
    const walletToSend = updatedWallets.find((w: any) => w.id === id);

    try {
      await updateWallet(walletToSend);
    } catch {
      onChange(prev); // revert
    }
  };

  const handleAdd = async () => {
    if (!newLabel || !newAddress) return;

    const newWallet = {
      label: newLabel,
      address: newAddress,
      chain: "base",
      tags: ["ops"],
      bots: []
    };

    try {
      await addWallet(newWallet);
      // reload
      const data = await getWallets();
      const normalized = Array.isArray(data) ? data : (data as any)?.wallets || [];
      onChange(normalized);
      setIsAdding(false);
      setNewLabel("");
      setNewAddress("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col h-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Wallet lanes</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="text-[10px] text-sky-400 opacity-80 hover:opacity-100">
          {isAdding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {loading && <div className="text-xs text-zinc-400">Loading...</div>}

      {isAdding && (
        <div className="mb-2 p-2 rounded bg-zinc-950/50 border border-zinc-800 space-y-2">
          <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100" placeholder="Label (e.g. Ops Hot)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
          <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono" placeholder="0x..." value={newAddress} onChange={e => setNewAddress(e.target.value)} />
          <button onClick={handleAdd} className="w-full rounded bg-emerald-600 py-1 text-[10px] font-bold text-white hover:bg-emerald-500">
            Save New Wallet
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {walletList.map((w: any) => {
          const isSelected = selected?.id === w.id;
          return (
            <div
              key={w.id}
              onClick={() => onSelect?.(isSelected ? null : w)}
              className={`rounded bg-zinc-900/80 px-2 py-2 text-xs space-y-1 cursor-pointer transition relative group ${isSelected ? "border border-sky-500 bg-zinc-800" : "border border-zinc-800 border-l-2 border-l-zinc-700"
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-semibold text-zinc-200">{w.label}</span>
                  <span className="text-[10px] items-center px-1 rounded bg-zinc-950 text-zinc-500 font-mono">{w.address?.slice(0, 6)}...</span>
                </div>
                <div className="text-emerald-400 font-mono font-bold">
                  ${w.balanceUsd || "0.00"}
                </div>
              </div>

              <div className="flex gap-1 flex-wrap">
                {w.tags?.map((t: string) => <span key={t} className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">{t}</span>)}
              </div>

              {/* Quick Edit (Label only for now or tags) */}
              <input
                className="w-full bg-transparent text-[10px] text-zinc-500 placeholder-zinc-700 border-none focus:outline-none focus:text-zinc-300 mt-1"
                placeholder="Memo / notes..."
                value={w.notes || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  updateWalletField(w.id, { notes: e.target.value });
                }}
                onClick={e => e.stopPropagation()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
