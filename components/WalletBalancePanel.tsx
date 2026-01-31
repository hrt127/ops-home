import React, { useEffect, useState } from "react";
import { getWalletBalances } from "../lib/api/alchemy";

export default function WalletBalancePanel({ address }: { address: string }) {
    const [balances, setBalances] = useState<any>(null);

    useEffect(() => {
        async function load() {
            const data = await getWalletBalances(address);
            setBalances(data);
        }

        load();
    }, [address]);

    if (!balances) {
        return <div className="text-zinc-500 text-sm">Loading balances…</div>;
    }

    return (
        <div className="text-sm text-zinc-300">
            <pre className="text-xs bg-zinc-900 p-3 rounded">
                {JSON.stringify(balances, null, 2)}
            </pre>
        </div>
    );
}
