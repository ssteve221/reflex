# Reflex — Trade-Off Log

> One-page analysis required by the Week 3 rubric.  
> Every system design has weak points. Surfacing yours first shows mastery.

---

## Trade-off 1 — localStorage instead of a shared backend

**What it is**: All delivery data is stored in the browser's `localStorage`. Two people on different machines (or even different browser profiles on the same machine) share no state.

**Why we accepted it**: For a prototype demoed from a single machine, one browser can run all three roles (Retailer / Dispatcher / Rider) in separate tabs. This removed a full backend build from the critical path, letting us focus on the delivery workflow itself.

**Real cost**: A real retailer's laptop and a real dispatcher's tablet would each see a completely different dataset. The "3-second polling" in the code only syncs state within one browser context.

**What we'd do with more time**: Replace `src/lib/storage.js` with a `fetch()` layer pointing to a lightweight REST API (Node/Express + SQLite on Render). The module interface — `storage.get()`, `storage.set()`, `storage.delete()` — is already designed as a drop-in swap. Every component would work unchanged.

---

## Trade-off 2 — Passwords stored in plain text

**What it is**: Retailer accounts are stored as `{ email, password }` JSON in `localStorage`. There is no hashing, no salt, no token expiry.

**Why we accepted it**: Authentication is not the core feature being evaluated. Hashing (bcrypt) + JWT sessions require a backend server, which we excluded (see Trade-off 1). In a local prototype that never leaves the demo machine, this poses no real risk.

**Real cost**: If someone inspects `localStorage` in DevTools they can read every password. This is zero-tolerance unacceptable in production.

**What we'd do with more time**: Move auth to the server side. Hash passwords with `bcrypt` (cost factor ≥ 12). Issue short-lived JWTs. Add a `POST /api/auth/refresh` endpoint. Delete the plain-text accounts from `localStorage` entirely.

---

## Trade-off 3 — Hardcoded rider list

**What it is**: `RIDERS = ["Kevin", "Amina", "John"]` is a constant in `src/constants.js`. There is no way for a dispatcher to add, remove, or deactivate a rider in the current UI.

**Why we accepted it**: Three riders are enough to demonstrate the assignment workflow. A CRUD rider-management screen would have added a fourth user persona and doubled the UI surface area for no rubric credit.

**Real cost**: Deploying this to a real business means editing source code every time a rider joins or leaves. That's not viable.

**What we'd do with more time**: Add a `riders` table to the database (or a `reflex:riders` key in `localStorage` as a quick win). Add a simple admin panel under a new "Admin" tab that lets a dispatcher add/remove riders. The `RIDERS` constant becomes the default seed.

---

## Trade-off 4 — No optimistic locking on assignment

**What it is**: When a dispatcher assigns a rider, the app writes directly to `localStorage` without checking whether another tab (simulating a second dispatcher) has already assigned that order.

**Why we accepted it**: The prototype runs in a single browser. Race conditions between two real dispatchers are impossible in the demo context.

**Real cost**: In a production system with two dispatchers working simultaneously, both could assign the same order to different riders. The second write silently overwrites the first — no conflict is detected or reported.

**What we'd do with more time**: Server-side assignment: a `PATCH /api/deliveries/:id/assign` endpoint that runs inside a database transaction and returns HTTP 409 Conflict if the delivery is already assigned. The frontend shows an error toast and re-fetches the current state.

---

## Trade-off 5 — CDN-loaded dependencies in Electron build

**What it is**: The Electron desktop wrapper (`electron-app/index.html`) loads React, Tailwind, Lucide, and SheetJS from public CDNs at startup.

**Why we accepted it**: The Electron wrap was a bonus artifact. Vendoring libraries locally would have required a build step inside the Electron project, duplicating the Vite build pipeline.

**Real cost**: No internet connection = blank screen. The app is not truly offline-capable despite being packaged as a desktop app.

**What we'd do with more time**: Point the Electron app at the Vite build output (`dist/`) instead of the hand-written `index.html`. After `npm run build`, `main.js` loads `dist/index.html` — fully offline, no CDNs.
