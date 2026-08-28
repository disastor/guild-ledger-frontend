const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getCharacters: () => request("/api/characters"),
  getCharacter: (id) => request(`/api/characters/${id}`),
  searchCharacters: (name) => request(`/api/characters/search?name=${encodeURIComponent(name)}`),
  createCharacter: (data) =>
    request("/api/characters", { method: "POST", body: JSON.stringify(data) }),
  deleteCharacter: (id) => request(`/api/characters/${id}`, { method: "DELETE" }),
  getMatches: (characterId) => request(`/api/matches/character/${characterId}`),
  logMatch: (data) => request("/api/matches", { method: "POST", body: JSON.stringify(data) }),
};
