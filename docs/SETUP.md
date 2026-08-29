# Reflex — Cross-Machine Setup Guide

> Works on Linux, macOS, and Windows. Follow the section for your OS.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18 or newer | `node --version` |
| npm | 9 or newer | `npm --version` |
| Git | Any modern version | `git --version` |

### Install Node.js

- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- **macOS** (with Homebrew):
  ```bash
  brew install node
  ```

- **Windows**: Download the LTS installer from [nodejs.org](https://nodejs.org) and run it.

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/<your-org>/reflex.git
cd reflex
```

> Replace `<your-org>` with your actual GitHub username or organisation.

---

## Step 2 — Install dependencies

```bash
npm install
```

This installs React, Vite, Tailwind, Lucide, SheetJS, Vitest, and Playwright.

---

## Step 3 — Run the development server

```bash
npm run dev
```

Open your browser at **http://localhost:5173**.

The app will hot-reload whenever you save a file.

---

## Step 4 — Run the unit tests

```bash
npm run test
```

Expected output: all tests pass (green). There are currently **~20 unit tests** covering the connector layer, status flow, utilities, and storage.

To run with a coverage report:

```bash
npm run test:coverage
```

Coverage report opens at `coverage/index.html`.

---

## Step 5 (optional) — Run the end-to-end tests

Playwright runs a real Chromium browser. It will auto-start the dev server.

```bash
npm run test:e2e
```

> **Note**: The first run will download Playwright's browser binaries (~200 MB). This only happens once.

---

## Troubleshooting

### `EACCES` permission errors on Linux
```bash
sudo chown -R $USER ~/.npm
```

### Port 5173 already in use
```bash
# Find and kill the process using the port
lsof -i :5173
kill -9 <PID>
```

Or start Vite on a different port:
```bash
npm run dev -- --port 3000
```

### Tailwind classes not applying
Make sure you're running `npm run dev` (not opening `index.html` directly in the browser). Tailwind is processed by Vite.

### Tests fail with "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Windows: `npx` not recognised
Open a new terminal after installing Node.js — the PATH update requires a new shell session.

### Windows: Line ending issues
```bash
git config --global core.autocrlf false
```
Set this before cloning.

---

## Environment variables

The current prototype has **no `.env` file** — all config is hardcoded. When a backend is added, create a `.env` file at the root:

```env
VITE_API_URL=http://localhost:3001
```

Never commit `.env` to git — it's already in `.gitignore`.

---

## Project structure at a glance

```
reflex/
├── src/
│   ├── components/     ← React UI components (one per role)
│   ├── hooks/          ← useDeliveries — all state + persistence
│   ├── lib/            ← storage.js, connectors.js, utils.js
│   ├── constants.js    ← STATUS_FLOW, RIDERS, etc.
│   ├── App.jsx         ← Root: nav, tabs, view routing
│   └── main.jsx        ← Entry point
├── tests/
│   ├── unit/           ← Vitest unit tests
│   └── e2e/            ← Playwright end-to-end tests
├── docs/               ← All assignment documentation
└── index.html          ← HTML shell
```
