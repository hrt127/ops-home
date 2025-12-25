import React from "react";

export default function WalletLanes(props: any) {
  const { wallets, onChange, selected, onSelect } = props;

  const updateWallet = (id: string, patch: any) => {
    const updated = wallets.map((w: any) => (w.id === id ? { ...w, ...patch } : w));
    onChange(updated);
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Wallet lanes</h2>
      </div>
      <div className="space-y-2">
        {wallets.map((w: any) => {
          const isSelected = selected?.id === w.id;
          return (
            <div
              key={w.id}
              onClick={() => onSelect?.(isSelected ? null : w)}
              className={`rounded bg-zinc-900/80 px-2 py-2 text-xs space-y-1 cursor-pointer transition ${
                isSelected ? "border border-sky-500 bg-zinc-800" : "border border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  className="w-full bg-transparent text-zinc-100 text-xs border-b border-zinc-700 focus:outline-none focus:border-sky-500"
                  value={w.label}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateWallet(w.id, { label: e.target.value || w.id });
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <select
                  className="rounded px-1.5 py-0.5 text-[10px] bg-zinc-950 border border-zinc-700"
                  value={w.riskBand}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateWallet(w.id, { riskBand: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="safe">SAFE</option>
                  <option value="operational">OPS</option>
                  <option value="speculative">SPEC</option>
                </select>
              </div>
              <input
                className="w-full bg-transparent text-[11px] text-zinc-300 border-b border-zinc-800 focus:outline-none focus:border-sky-500"
                value={w.purpose}
                onChange={(e) => {
                  e.stopPropagation();
                  updateWallet(w.id, { purpose: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <textarea
                className="mt-1 w-full bg-zinc-950 text-[10px] text-zinc-400 rounded border border-zinc-800 px-1 py-1 resize-none focus:outline-none focus:border-sky-500"
                rows={2}
                placeholder="Notes / rules"
                value={w.notes || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  updateWallet(w.id, { notes: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
