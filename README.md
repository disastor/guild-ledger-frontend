# Guild Ledger

A static RPG character roster + win/loss tracker. React (Vite), no backend — all
data lives in the browser's `localStorage`.

> Built as a demo target for the CloudBees Policy Engine — see `DEMO_NOTES.md` for
> the issues intentionally seeded in this codebase.

## Run locally

```bash
docker compose up --build
```

- App: http://localhost:5173

Seeded with a few sample characters and matches on first load (see `src/storage.js`).
Data resets if you clear your browser storage, or via the in-app "Reset Season"
control (password in `.env`).

## Deploying

Deploys to Netlify as a static site:

- Build command: `npm run build`
- Publish directory: `dist`

The `VITE_RIOT_API_KEY` and `VITE_ADMIN_PASSWORD` env vars in `.env` get baked
into the built JS bundle at build time — set the real values as Netlify
environment variables for a production deploy rather than shipping this `.env`
as-is (see `DEMO_NOTES.md` for why that matters).
