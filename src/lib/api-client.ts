// Centralized API client for CRUD operations on wallets, events, notes, and ideas
// Uses fetch and returns JSON. Handles optimistic updates and background sync.

export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


// --- Notes (Deprecated/Removed) ---
// Functions removed as they are not part of Fs-based V1 currently or implemented elsewhere.

// --- Events & Alerts ---
export async function getEvents() {
  return fetchAPI('/api/events');
}
export async function dismissAlert(id: string) {
  return fetchAPI('/api/events', {
    method: 'POST',
    body: JSON.stringify({ action: 'dismiss', id })
  });
}

// --- Market Strip ---
export async function getMarketStrip() {
  return fetchAPI('/api/market-strip');
}
export async function updateMarketPairs(pairs: string[]) {
  return fetchAPI('/api/market-strip', {
    method: 'POST',
    body: JSON.stringify({ pairs })
  });
}

// --- Wallets ---
export async function getWallets() {
  return fetchAPI('/api/wallets');
}
export async function addWallet(wallet: any) {
  return fetchAPI('/api/wallets', {
    method: 'POST',
    body: JSON.stringify({ action: 'add', wallet })
  });
}
export async function updateWallet(wallet: any) {
  return fetchAPI('/api/wallets', {
    method: 'POST',
    body: JSON.stringify({ action: 'update', wallet })
  });
}

// --- Ideas (FS-based) ---
export async function getIdeas() {
  const data = await fetchAPI<{ items: any[] }>('/api/inbox');
  return data.items || [];
}
export async function createIdea(idea: { text: string }) {
  return fetchAPI('/api/inbox', {
    method: 'POST',
    body: JSON.stringify({ action: 'add', text: idea.text }),
  });
}
export async function updateIdea(id: string, patch: { status: string }) {
  return fetchAPI('/api/inbox', {
    method: 'POST',
    body: JSON.stringify({ action: 'update', id, status: patch.status }),
  });
}
export async function deleteIdea(id: string) {
  console.warn('Delete not implemented in FS backend yet');
  return {};
}

// --- Freqtrade ---
export async function getFreqtradeList() {
  return fetchAPI('/api/freqtrade');
}
export async function getFreqtradeDetail(name: string) {
  return fetchAPI(`/api/freqtrade?name=${name}`);
}
export async function updateFreqtradeNarrative(name: string, narrativeUpdate: string) {
  return fetchAPI('/api/freqtrade', {
    method: 'POST',
    body: JSON.stringify({ name, narrativeUpdate })
  });
}

// --- Builder Signal ---
export async function getBuilderSignals() {
  return fetchAPI<string[]>('/api/builder-signal');
}

// --- Daily Focus ---
export async function getDailyFocus() {
  return fetchAPI('/api/daily-focus');
}

export async function addDailyTask(task: string) {
  return fetchAPI('/api/daily-focus', {
    method: 'POST',
    body: JSON.stringify({ action: 'add', task }),
  });
}

export async function toggleDailyTask(id: string) {
  return fetchAPI('/api/daily-focus', {
    method: 'POST',
    body: JSON.stringify({ action: 'toggle', id }),
  });
}
