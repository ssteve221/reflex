# Reflex — Team Task Breakdown

> 5-person split for the Week 3 assignment.  
> Each person owns a branch, makes ≥ 2 commits, and opens a Pull Request to `main`.

---

## Overview

| Person | Role | Branch | Main Responsibility |
|--------|------|--------|---------------------|
| **P1** | Project Lead | `setup` | Repo init, CI config, architecture decisions, README |
| **P2** | Backend/Data | `feature/storage-layer` | `src/lib/storage.js`, `src/lib/connectors.js`, `src/hooks/useDeliveries.js` |
| **P3** | Frontend Dev | `feature/ui-components` | All `src/components/` files, `src/App.jsx`, `src/index.css` |
| **P4** | QA / Testing | `feature/tests` | `tests/unit/`, `tests/e2e/`, `playwright.config.js`, Vitest setup |
| **P5** | Docs & DevOps | `feature/docs` | `docs/`, `.github/workflows/ci.yml`, `.gitignore`, deployment |

---

## Git Workflow (step by step for all 5)

### Initial setup (P1 does this first, others follow)

```bash
# P1: initialise the repo
cd /path/to/reflex
git init
git add .
git commit -m "feat: initial Vite React scaffold"
git branch -M main

# Create a GitHub repo, then:
git remote add origin https://github.com/<org>/reflex.git
git push -u origin main
```

### Each team member

```bash
# 1. Clone the repo
git clone https://github.com/<org>/reflex.git
cd reflex

# 2. Check out your branch
git checkout -b feature/<your-branch-name>

# 3. Install dependencies
npm install

# 4. Do your work, commit often
git add <files>
git commit -m "feat: <description of what you did>"

# 5. Push and open a PR
git push -u origin feature/<your-branch-name>
# Then open a Pull Request on GitHub targeting main
```

---

## Detailed Per-Person Breakdown

### P1 — Project Lead (`setup` branch)

**Commits:**
1. `chore: initialise Vite React project with Tailwind + Vitest`
2. `chore: add .gitignore, README, and CI workflow`
3. `docs: add architecture decision record`

**Files owned:**
- `.gitignore`
- `README.md`
- `.github/workflows/ci.yml`
- `vite.config.js` (Vitest section)
- `tailwind.config.js`
- `index.html`

---

### P2 — Storage & Data Layer (`feature/storage-layer` branch)

**Commits:**
1. `feat: add localStorage storage shim (storage.js)`
2. `feat: add import connector layer (connectors.js, FIELD_ALIASES)`
3. `feat: extract useDeliveries hook with polling and all delivery actions`
4. `feat: add constants and utility helpers`

**Files owned:**
- `src/lib/storage.js`
- `src/lib/connectors.js`
- `src/lib/utils.js`
- `src/constants.js`
- `src/hooks/useDeliveries.js`

---

### P3 — UI Components (`feature/ui-components` branch)

**Commits:**
1. `feat: add shared UI components (StatusBadge, EmptyState, Field)`
2. `feat: add LoginView with sign-in/sign-up toggle`
3. `feat: add RetailerView with delivery form and list`
4. `feat: add DispatcherView and RiderView`
5. `feat: add TrackingView with delivery timeline and POD capture`
6. `feat: add ImportPanel with spreadsheet/JSON connectors`
7. `feat: add SignaturePad canvas component`
8. `feat: wire all views in App.jsx`

**Files owned:**
- `src/components/ui.jsx`
- `src/components/LoginView.jsx`
- `src/components/RetailerView.jsx`
- `src/components/DispatcherView.jsx`
- `src/components/RiderView.jsx`
- `src/components/TrackingView.jsx`
- `src/components/ImportPanel.jsx`
- `src/components/SignaturePad.jsx`
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`

---

### P4 — QA & Testing (`feature/tests` branch)

**Commits:**
1. `test: add Vitest unit tests for connector layer (findField, mapRowsToDeliveries)`
2. `test: add Vitest unit tests for STATUS_FLOW, utils, and status progression`
3. `test: add Playwright e2e test config and delivery lifecycle spec`
4. `ci: add test step to GitHub Actions workflow`

**Files owned:**
- `tests/setup.js`
- `tests/unit/connectors.test.js`
- `tests/unit/statusFlow.test.js`
- `tests/e2e/delivery.spec.js`
- `playwright.config.js`

---

### P5 — Docs & DevOps (`feature/docs` branch)

**Commits:**
1. `docs: add SETUP.md (cross-machine setup guide)`
2. `docs: add DEPLOY.md (Render + Vercel deployment guide)`
3. `docs: add TRADE_OFFS.md (5 weak points with justifications)`
4. `docs: add DEMO_SCRIPT.md and DECK_OUTLINE.md`
5. `docs: add TIMING_LOG.md`
6. `docs: add TEAM_TASKS.md`

**Files owned:**
- `docs/SETUP.md`
- `docs/DEPLOY.md`
- `docs/TRADE_OFFS.md`
- `docs/DEMO_SCRIPT.md`
- `docs/DECK_OUTLINE.md`
- `docs/TIMING_LOG.md`
- `docs/TEAM_TASKS.md`

---

## Ensuring All 5 Have Visible Contributions

```bash
# Check contributions at any time
git log --all --oneline --author="<name>"

# Or see the full contribution graph
git log --all --oneline --graph
```

Every PR merge creates a merge commit attributed to the merger. The feature branch commits are attributed to the branch author. GitHub's contribution graph will show activity for all 5 members as long as commits use their GitHub-registered email:

```bash
git config user.email "yourname@example.com"
git config user.name "Your Name"
```

Set this **before making your first commit** on your machine.
