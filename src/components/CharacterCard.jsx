import { useState } from "react";
import { api } from "../api";

export default function CharacterCard({ character, onChanged }) {
  const [matches, setMatches] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);

  const wins = matches ? matches.filter((m) => m.result === "win").length : null;
  const losses = matches ? matches.filter((m) => m.result === "loss").length : null;

  async function loadMatches() {
    const data = await api.getMatches(character.id);
    setMatches(data);
  }

  async function toggleExpand() {
    if (!expanded && matches === null) await loadMatches();
    setExpanded(!expanded);
  }

  async function logResult(result) {
    setBusy(true);
    try {
      await api.logMatch({ character_id: character.id, result, notes: "" });
      await loadMatches();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Retire ${character.name} from the roster?`)) return;
    await api.deleteCharacter(character.id);
    onChanged();
  }

  return (
    <div className="character-card">
      <h3>{character.name}</h3>
      <div className="character-meta">
        {character.class} · {character.role}
      </div>
      <div className="character-bio">{character.bio || "No bio recorded yet."}</div>

      <div className="tally-line" onClick={toggleExpand} style={{ cursor: "pointer" }}>
        {wins === null ? (
          <span>Tap to open the ledger</span>
        ) : (
          <>
            <span className="tally-wins">{wins}W</span>
            <span className="tally-losses">{losses}L</span>
            <span style={{ marginLeft: "auto", color: "var(--parchment-dim)" }}>
              {expanded ? "hide" : "show"}
            </span>
          </>
        )}
      </div>

      {expanded && matches && (
        <ul className="match-log">
          {matches.length === 0 && <li>No matches logged yet.</li>}
          {matches.map((m) => (
            <li key={m.id}>
              <span className={m.result === "win" ? "result-win" : "result-loss"}>
                {m.result.toUpperCase()}
              </span>
              <span>{new Date(m.played_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="card-actions">
        <button className="btn btn-win" disabled={busy} onClick={() => logResult("win")}>
          Log Win
        </button>
        <button className="btn btn-loss" disabled={busy} onClick={() => logResult("loss")}>
          Log Loss
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Retire
        </button>
      </div>
    </div>
  );
}
