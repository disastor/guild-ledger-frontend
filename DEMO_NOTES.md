# Demo Notes — Seeded Issues

This app was deliberately built the way a rushed, "vibe coded" internal tool gets
built — someone paired with an AI, shipped fast, and skipped review. Nothing here
is a real credential; it's fake/demo data. Use this as the answer key when walking
through what the Policy Engine / scanning step catches.

| # | Issue | Where | Why it matters |
|---|-------|-------|-----------------|
| 1 | Secrets committed to the repo | `.env` | Classic secret-sprawl: an API key and a password sitting in plaintext in version control. Secret scanning should flag the file directly. |
| 2 | Secrets shipped to the browser | `src/storage.js`, `src/components/AdminGate.jsx` (via `import.meta.env.VITE_*`) | Worse than issue #1 in practice: Vite bakes `VITE_`-prefixed env vars directly into the built JS bundle. Anyone who opens dev tools on the deployed site can read these values — no repo access needed at all. |
| 3 | Client-side-only "auth" | `src/components/AdminGate.jsx` | The Reset Season gate compares against a password that shipped in the bundle. It's trivially bypassable (read the bundle, or just call `storage.resetAll()` from the console) and was never real access control to begin with. |
| 4 | Unsanitized HTML rendering | `src/components/CharacterCard.jsx` | The bio field renders via `dangerouslySetInnerHTML` with no sanitization. A SAST scan should flag this API usage regardless of whether this specific app has a practical exploit path — it's the same pattern that causes real stored-XSS in apps with shared/synced data. |
| 5 | Outdated / vulnerable dependency | `package.json` | `lodash@4.17.4` is an old version with known published CVEs (prototype pollution). It's actually used (`cloneDeep` in `storage.js`), so it's a real dependency, not just an unused entry. |

## Suggested demo flow

1. Show the repo on GitHub as-is — point out `.env` is tracked.
2. Run the CloudBees Unify workflow with the Policy Engine step wired in.
3. Watch it flag items 1 and 5 automatically (secret scanning, SCA/dependency CVEs).
4. Open the deployed site's dev tools and search the loaded JS for `RGAPI-` or
   `letmein` — show that item #2 is catchable by a secrets-in-build-artifact scan,
   not just a git-history scan, and that it's exposed regardless of what gets
   caught pre-merge if this step isn't in the pipeline.
5. Point out item #4 (`dangerouslySetInnerHTML`) as the kind of SAST finding that's
   easy to miss in review but trivial for a scanner to catch every time.
6. Fix one issue live (e.g., move the bio render to plain text interpolation) and
   re-run to show the gate turning green.
