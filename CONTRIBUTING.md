# Contributing

This started as a solo college case study, but it follows the same basic
workflow used on real teams.

## Branching

- `main` is always deployable.
- Work on a short-lived branch per change: `feature/<name>`,
  `fix/<name>`, or `docs/<name>`.
- Open a pull request into `main`; CI (`.github/workflows/ci.yml`) must pass
  before merging.

## Commits

Keep commits small and describe *what* changed and *why*, e.g.:

```
Fix: return 400 instead of 500 for negative stock quantity
```

## Code style

- Backend: plain CommonJS (`require`), `async/await` with `try/catch` in
  every controller, one comment per function/non-obvious line. No
  TypeScript, no extra frameworks - see `backend/package.json` for the
  exact allowed dependency list.
- Frontend: functional React components, only `useState`/`useEffect`. No
  business logic in the UI - it only calls the REST API.

## Running checks locally before pushing

```bash
cd backend && npm install && npm run dev     # should log "MongoDB connected"
cd frontend && npm install && npm run build  # should finish with no errors
```
