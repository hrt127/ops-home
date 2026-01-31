export async function getTokenPrice(tokenId: string) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;

    const res = await fetch(url);
    const json = await res.json();

    return json[tokenId]?.usd ?? null;
}
