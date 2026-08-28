import { useState } from "react";
import { storage } from "../storage";

const initialState = { name: "", class: "", role: "", bio: "" };

export default function NewCharacterForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    storage.createCharacter(form);
    setForm(initialState);
    onCreated();
    setSubmitting(false);
  }

  return (
    <form className="new-character-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="class">Class</label>
        <input
          id="class"
          value={form.class}
          onChange={(e) => update("class", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="role">Role</label>
        <input
          id="role"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          required
        />
      </div>
      <div className="field full-width">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
      </div>
      <div className="form-footer">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Recording…" : "Add to Roster"}
        </button>
      </div>
    </form>
  );
}
