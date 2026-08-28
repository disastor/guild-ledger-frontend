import { useEffect, useState } from "react";
import { api } from "./api";
import CharacterCard from "./components/CharacterCard";
import NewCharacterForm from "./components/NewCharacterForm";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  async function loadCharacters() {
    try {
      setError(null);
      const data = await api.getCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <div className="app-shell">
      <div className="masthead">
        <h1>The Guild Ledger</h1>
        <span className="subtitle">Roster &amp; Match Record</span>
      </div>

      {error && <div className="error-banner">Couldn't reach the ledger: {error}</div>}

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
    </div>
  );
}
