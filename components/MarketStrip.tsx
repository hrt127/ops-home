import React, { useEffect, useState } from "react";
import { getTokenPrice } from "../lib/api/coingecko";

export default function MarketStrip() {
    const [prices, setPrices] = useState<{ [k: string]: number | null }>({});

    useEffect(() => {
        async function load() {
            const tokens = ["ethereum", "bitcoin", "base"];
            const results: any = {};

            for (const t of tokens) {
                results[t] = await getTokenPrice(t);
            }

            setPrices(results);
        }

        load();
    }, []);

    return (
        <div className="flex gap-6 text-sm text-zinc-300">
            {Object.entries(prices).map(([token, price]) => (
                <div key={token}>
                    <span className="uppercase text-zinc-500">{token}</span>{" "}
                    <span>${price ?? "—"}</span>
                </div>
            ))}
        </div>
    );
}
