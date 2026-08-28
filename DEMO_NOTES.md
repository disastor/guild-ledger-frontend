# Demo Notes — Frontend Component

Unlike `guild-ledger-backend`, this component was left clean on purpose. It's a
plain Vite + React static site with no secrets, no server-side logic, and no
dependency on anything unusual.

Use it as the contrast in the demo: when the Policy Engine runs against both
components, this one should pass cleanly while `guild-ledger-backend` lights up —
a good visual for "governance applies per-component, not as a single pass/fail
for the whole app."
