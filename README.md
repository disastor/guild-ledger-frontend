# Guild Ledger — Web

React (Vite) frontend for the Guild Ledger character/win-loss tracker.

## Run locally

```bash
cp .env.example .env   # point VITE_API_URL at your running backend
docker compose up --build
```

- App: http://localhost:5173

Needs the `guild-ledger-backend` API running somewhere reachable (defaults to
`http://localhost:4000`).

## Deploying

Built for static hosting — deploy to Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Env var: `VITE_API_URL` → set to your deployed backend's URL

## Companion repo

The API lives in a separate repo: `guild-ledger-backend`.
