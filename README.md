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

https://reflex-ofux.onrender.com

## Quick start

```bash
(https://github.com/ssteve221/reflex.git)
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
