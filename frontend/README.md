# Warehouse Stock Transfer Management - Frontend

A plain React (Vite) single-page app. It has no business logic of its own -
every page just calls the backend REST API and renders the response. See the
[root README](../README.md) for the full project overview.

## Setup

```bash
npm install
cp .env.example .env   # points at the backend's /api
npm run dev             # http://localhost:5173
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build, output to `dist/` |
| `npm run preview` | Serve the production build locally |

## Pages

| Route | Who can see it | Purpose |
| --- | --- | --- |
| `/login` | Everyone | Email/password login |
| `/dashboard` | Logged-in users | Product x warehouse stock table |
| `/transfer` | Logged-in users | Request a stock transfer |
| `/approvals` | Logged-in users (approve/reject buttons: managers only) | List + act on transfer requests |

## Environment variables

| Variable | Meaning |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5001/api` |
