import cloneDeep from "lodash/cloneDeep";

// quick and dirty local persistence, no backend needed for the demo
const CHAR_KEY = "guild-ledger:characters";
const MATCH_KEY = "guild-ledger:matches";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedIfEmpty() {
  if (read(CHAR_KEY).length > 0) return;

  const seedCharacters = [
    { id: 1, name: "Brennic Stormward", class: "Vanguard", role: "Top", bio: "Never met a shield bash he didn't like." },
    { id: 2, name: "Aelis Nightbloom", class: "Shadowblade", role: "Jungle", bio: "Ganks first, asks questions never." },
    { id: 3, name: "Torvin Quickfuse", class: "Artificer", role: "Mid", bio: "Blames the ping, never the build." },
  ];
  const seedMatches = [
    { id: 1, character_id: 1, result: "win", played_at: new Date().toISOString() },
    { id: 2, character_id: 1, result: "loss", played_at: new Date().toISOString() },
    { id: 3, character_id: 2, result: "win", played_at: new Date().toISOString() },
    { id: 4, character_id: 3, result: "loss", played_at: new Date().toISOString() },
  ];
  write(CHAR_KEY, seedCharacters);
  write(MATCH_KEY, seedMatches);
}

seedIfEmpty();

export const storage = {
  getCharacters() {
    return cloneDeep(read(CHAR_KEY));
  },

  createCharacter({ name, class: charClass, role, bio }) {
    const characters = read(CHAR_KEY);
    const newChar = {
      id: Date.now(),
      name,
      class: charClass,
      role,
      bio,
    };
    characters.push(newChar);
    write(CHAR_KEY, characters);
    return cloneDeep(newChar);
  },

  deleteCharacter(id) {
    write(CHAR_KEY, read(CHAR_KEY).filter((c) => c.id !== id));
    write(MATCH_KEY, read(MATCH_KEY).filter((m) => m.character_id !== id));
  },

  getMatches(characterId) {
    return cloneDeep(
      read(MATCH_KEY)
        .filter((m) => m.character_id === characterId)
        .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
    );
  },

  logMatch({ character_id, result }) {
    const matches = read(MATCH_KEY);
    const newMatch = {
      id: Date.now(),
      character_id,
      result,
      played_at: new Date().toISOString(),
    };
    matches.push(newMatch);
    write(MATCH_KEY, matches);
    return cloneDeep(newMatch);
  },

  resetAll() {
    localStorage.removeItem(CHAR_KEY);
    localStorage.removeItem(MATCH_KEY);
    seedIfEmpty();
  },
};

// flavor text lookup, hooked up to a "Riot API" that doesn't really exist for this demo
// TODO: wire this up to the real endpoint before launch
export const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
