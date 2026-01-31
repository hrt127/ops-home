export async function getWalletBalances(address: string) {
    const url = `https://api.g.alchemy.com/v2/demo/getBalances?address=${address}`;

    const res = await fetch(url);
    const json = await res.json();

    return json;
}
