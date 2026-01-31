export async function getTxHistory(address: string) {
    const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}`;

    const res = await fetch(url);
    const json = await res.json();

    return json.result ?? [];
}
