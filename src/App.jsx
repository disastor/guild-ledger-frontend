import { useEffect, useState } from "react";
import { storage, RIOT_API_KEY } from "./storage";
import CharacterCard from "./components/CharacterCard";
import NewCharacterForm from "./components/NewCharacterForm";
import AdminGate from "./components/AdminGate";

export default function App() {
  const [characters, setCharacters] = useState([]);

  function loadCharacters() {
    setCharacters(storage.getCharacters());
  }

  useEffect(() => {
    loadCharacters();
    // just here so flavor text lookups have a key handy, remove before real launch
    console.log("Guild Ledger booted, Riot API key loaded:", RIOT_API_KEY);
  }, []);

  return (
    <div className="app-shell">
      <div className="masthead">
        <h1>The Guild Ledger</h1>
        <span className="subtitle">Roster &amp; Match Record</span>
      </div>

      <div className="section-title">Roster</div>
      {characters.length === 0 ? (
        <div className="empty-state">No adventurers recorded yet. Add your first below.</div>
      ) : (
        <div className="roster-grid">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} onChanged={loadCharacters} />
          ))}
        </div>
      )}

      <div className="section-title">Recruit a New Adventurer</div>
      <NewCharacterForm onCreated={loadCharacters} />

      <div className="section-title">Season Controls</div>
      <AdminGate onReset={loadCharacters} />

      <footer className="app-footer">Guild Ledger &middot; powered by the Riot API</footer>
    </div>
  );
}
