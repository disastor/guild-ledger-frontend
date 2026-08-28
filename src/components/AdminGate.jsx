import { useState } from "react";
import { storage } from "../storage";

// simple gate so randos can't nuke the season by accident
// TODO: move this server-side once we have a backend again
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminGate({ onReset }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      storage.resetAll();
      onReset();
      setOpen(false);
      setInput("");
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!open) {
    return (
      <button className="btn" onClick={() => setOpen(true)}>
        Reset Season
      </button>
    );
  }

  return (
    <form className="admin-gate" onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Admin password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button className="btn btn-loss" type="submit">
        Confirm Reset
      </button>
      <button className="btn" type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
      {error && <span className="admin-gate-error">Wrong password.</span>}
    </form>
  );
}
