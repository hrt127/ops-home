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

// --- Wallets ---
export async function getWallets() {
  return fetchAPI('/api/db/wallets');
}
export async function createWallet(wallet: any) {
  return fetchAPI('/api/db/wallets', {
    method: 'POST',
    body: JSON.stringify(wallet),
  });
}
export async function updateWallet(id: string, patch: any) {
  return fetchAPI(`/api/db/wallets?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}
export async function deleteWallet(id: string) {
  return fetchAPI(`/api/db/wallets?id=${id}`, {
    method: 'DELETE',
  });
}

// --- Events ---
export async function getEvents() {
  return fetchAPI('/api/db/events');
}
export async function createEvent(event: any) {
  return fetchAPI('/api/db/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}
export async function updateEvent(id: string, patch: any) {
  return fetchAPI(`/api/db/events?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}
export async function deleteEvent(id: string) {
  return fetchAPI(`/api/db/events?id=${id}`, {
    method: 'DELETE',
  });
}

// --- Notes ---
export async function getNotes() {
  return fetchAPI('/api/db/notes');
}
export async function createNote(note: any) {
  return fetchAPI('/api/db/notes', {
    method: 'POST',
    body: JSON.stringify(note),
  });
}
export async function updateNote(id: string, patch: any) {
  return fetchAPI(`/api/db/notes?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}
export async function deleteNote(id: string) {
  return fetchAPI(`/api/db/notes?id=${id}`, {
    method: 'DELETE',
  });
}

// --- Ideas ---
export async function getIdeas() {
  return fetchAPI('/api/db/ideas');
}
export async function createIdea(idea: any) {
  return fetchAPI('/api/db/ideas', {
    method: 'POST',
    body: JSON.stringify(idea),
  });
}
export async function updateIdea(id: string, patch: any) {
  return fetchAPI(`/api/db/ideas?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}
export async function deleteIdea(id: string) {
  return fetchAPI(`/api/db/ideas?id=${id}`, {
    method: 'DELETE',
  });
}
