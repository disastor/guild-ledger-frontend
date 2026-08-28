import { useState } from "react";
import { storage } from "../storage";

export default function CharacterCard({ character, onChanged }) {
  const [matches, setMatches] = useState(() => storage.getMatches(character.id));
  const [expanded, setExpanded] = useState(false);

  const wins = matches.filter((m) => m.result === "win").length;
  const losses = matches.filter((m) => m.result === "loss").length;

  function refreshMatches() {
    setMatches(storage.getMatches(character.id));
  }

  function logResult(result) {
    storage.logMatch({ character_id: character.id, result });
    refreshMatches();
  }

  function handleDelete() {
    if (!confirm(`Retire ${character.name} from the roster?`)) return;
    storage.deleteCharacter(character.id);
    onChanged();
  }

  return (
    <div className="character-card">
      <h3>{character.name}</h3>
      <div className="character-meta">
        {character.class} · {character.role}
      </div>
      {/* bio supports light formatting for flavor text, so it's rendered as raw HTML */}
      <div
        className="character-bio"
        dangerouslySetInnerHTML={{ __html: character.bio || "No bio recorded yet." }}
      />

      <div className="tally-line" onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer" }}>
        <span className="tally-wins">{wins}W</span>
        <span className="tally-losses">{losses}L</span>
        <span style={{ marginLeft: "auto", color: "var(--parchment-dim)" }}>
          {expanded ? "hide" : "show"}
        </span>
      </div>

      {expanded && (
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
        <button className="btn btn-win" onClick={() => logResult("win")}>
          Log Win
        </button>
        <button className="btn btn-loss" onClick={() => logResult("loss")}>
          Log Loss
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Retire
        </button>
      </div>
    </div>
  );
}
