# Reflex — Delivery Management

> A delivery management system for small Kenyan retailers built for the PLP Academy Week 3 assignment.

[![CI](https://github.com/<your-org>/reflex/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-org>/reflex/actions/workflows/ci.yml)

---

## What it does

Reflex replaces the WhatsApp groups that small retailers use to manage deliveries. Three roles, one shared view:

- **Retailer** — logs a delivery request (customer name, phone, address, item)
- **Dispatcher** — sees the open queue and assigns each request to a rider
- **Rider** — sees their assigned deliveries and updates status (Assigned → Picked Up → In Transit → Delivered)
- **Anyone** — tracks a delivery by reference number and signs off on proof of delivery

## Live demo

🌐 [https://reflex-delivery.onrender.com](https://reflex-delivery.onrender.com) _(deploy and update this link)_

## Quick start

```bash
git clone https://github.com/<your-org>/reflex.git
cd reflex
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Run tests

```bash
npm run test          # Vitest unit tests
npm run test:coverage # with coverage report
npm run test:e2e      # Playwright e2e (auto-starts dev server)
```

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/SETUP.md](docs/SETUP.md) | Cross-machine setup (Linux, macOS, Windows) |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Render + Vercel deployment guide |
| [docs/TRADE_OFFS.md](docs/TRADE_OFFS.md) | Architecture trade-offs and weak points |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | 10-minute demo script with speaker assignments |
| [docs/DECK_OUTLINE.md](docs/DECK_OUTLINE.md) | Presentation deck outline (one takeaway per slide) |
| [docs/TIMING_LOG.md](docs/TIMING_LOG.md) | Dry run timing log |
| [docs/TEAM_TASKS.md](docs/TEAM_TASKS.md) | 5-person task breakdown and git workflow |

## Team

| Name | Role | Branch |
|------|------|--------|
| P1 | Project Lead | `setup` |
| P2 | Storage & Data | `feature/storage-layer` |
| P3 | UI Components | `feature/ui-components` |
| P4 | QA & Testing | `feature/tests` |
| P5 | Docs & DevOps | `feature/docs` |

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v3
- **Icons**: Lucide React
- **Import**: SheetJS (xlsx) for spreadsheet parsing
- **Storage**: localStorage (drop-in replaceable with a REST API — see `src/lib/storage.js`)
- **Testing**: Vitest (unit) + Playwright (e2e)
- **CI**: GitHub Actions

## Architecture decision

All data lives in `localStorage`. This means:
- ✅ No backend, no deployment complexity, works fully offline
- ❌ No cross-device sync (two people on separate machines see separate data)

This is a deliberate trade-off for the prototype phase. The `storage.js` module is designed as a seam — replace it with a `fetch()` layer to add a real backend without touching any component. See [docs/TRADE_OFFS.md](docs/TRADE_OFFS.md) for the full analysis.
