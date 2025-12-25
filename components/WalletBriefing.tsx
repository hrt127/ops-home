import React, { useEffect, useState } from "react";
import type { UIWallet } from "@/lib/agent-types";

interface WalletBalance {
  address: string;
  balance_eth: number;
  last_updated: string;
}

export default function WalletBriefing({ wallet }: { wallet: UIWallet | null }) {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet?.address) {
      setBalance(null);
      return;
    }

    const addr = wallet.address;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wallet?address=${encodeURIComponent(addr)}`);
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balances?.[addr] || null);
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [wallet?.address]);

  if (!wallet) {
    return (
      <div className="text-zinc-500 text-[11px]">
        Click a wallet lane to see full briefing: address, browser profile, provider, persona, and rules.
      </div>
    );
  }

  const riskLabel = (band: string) => band?.toUpperCase?.() || band;

  return (
    <div className="text-[11px] flex flex-col gap-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-zinc-200">{wallet.label}</span>
        {wallet.address && (
          <span className="text-zinc-500 text-[10px]">
            {wallet.address.substring(0, 6)}...{wallet.address.substring(-4)}
          </span>
        )}
      </div>

      {balance && !loading && (
        <div className="text-emerald-300">
          <span className="font-semibold text-emerald-200">Balance: </span>
          {balance.balance_eth.toFixed(4)} ETH
          <span className="text-[10px] text-zinc-400 ml-2">
            ({new Date(balance.last_updated).toLocaleTimeString()})
          </span>
        </div>
      )}

      {loading && (
        <div className="text-zinc-400 text-[10px]">Fetching balance...</div>
      )}
      {wallet.browserProfile && (
        <div className="text-zinc-300">
          <span className="font-semibold text-zinc-200">Browser: </span>
          {wallet.browserProfile}
          {wallet.provider && (
            <>
              {" · "}
              <span className="font-semibold text-zinc-200">Provider: </span>
              {wallet.provider}
            </>
          )}
        </div>
      )}
      {wallet.persona && (
        <div className="text-zinc-300">
          <span className="font-semibold text-zinc-200">Persona: </span>
          {wallet.persona}
          {" · "}
          <span className="font-semibold text-zinc-200">Risk: </span>
          {riskLabel(wallet.riskBand)}
        </div>
      )}
      {wallet.forbiddenWith && wallet.forbiddenWith.length > 0 && (
        <div className="text-rose-300">
          <span className="font-semibold text-rose-200">Never with: </span>
          {wallet.forbiddenWith.join(", ")}
        </div>
      )}
      {wallet.allowedWith && wallet.allowedWith.length > 0 && (
        <div className="text-emerald-300">
          <span className="font-semibold text-emerald-200">Allowed: </span>
          {wallet.allowedWith.join(", ")}
        </div>
      )}
      {wallet.notes && (
        <div className="text-zinc-400 italic">Note: {wallet.notes}</div>
      )}
    </div>
  );
}
