# Reflex — Demo Script

> **Format**: 10-minute presentation + 10-minute cross-exam.  
> Timing is critical. Use this script to hit exactly 10 minutes.

---

## Speaker assignments (5-person team)

| Segment | Time | Speaker |
|---------|------|---------|
| Problem framing | 0:00 – 1:30 | P1 |
| Solution overview | 1:30 – 3:00 | P2 |
| Live demo — Retailer + Import | 3:00 – 5:30 | P3 |
| Live demo — Dispatcher + Rider + Tracking | 5:30 – 7:30 | P3 |
| Architecture + Trade-offs | 7:30 – 9:00 | P2 |
| Roadmap | 9:00 – 10:00 | P1 |

---

## Script

### 0:00 — Problem (P1)

> "Small Kenyan retailers — electronics shops, pharmacies, hardware stores — manage deliveries entirely over WhatsApp and phone calls. There's no record of who's assigned, no status visibility, no proof a delivery ever happened.
>
> Every missed or contested delivery costs money and trust. And with no paper trail, there's no way to hold anyone accountable.
>
> We built Reflex to fix that."

**Key takeaway on slide**: *The problem is costly, invisible, and solved by WhatsApp today.*

---

### 1:30 — Solution (P2)

> "Reflex is a three-role delivery management system.
>
> A retailer logs a request with the customer's name, phone, address, and what's being delivered. A dispatcher sees the queue and assigns it to a rider. The rider sees their list and taps to update status as they go. And anyone with the reference number can track it live.
>
> No WhatsApp groups. No missed updates. Full audit trail from new to delivered."

**Key takeaway on slide**: *Three roles, one shared view — retailer, dispatcher, rider.*

---

### 3:00 — Live demo: Retailer (P3, screen shared)

1. Open the Retailer tab (already on screen)
2. Sign in as "Nairobi Electronics"
3. Fill the form: Grace Wanjiru, +254712345678, 14 Ngong Road, 1x LED TV
4. Click "Log delivery" → card appears with reference **RFX-XXXXX**, status **New**
5. Say: *"The reference is the handoff artefact — it's what the customer needs to track their order."*
6. Switch to Import panel → upload sample spreadsheet → show preview → import 3 rows
7. Say: *"One connector layer — the same pipeline handles a spreadsheet from a POS export or a JSON webhook. Adding a new source means writing one parse function."*

---

### 5:30 — Live demo: Dispatcher + Rider + Tracking (P3)

1. Switch to Dispatcher tab
2. Show the open requests including the one just logged
3. Assign Kevin to the Grace Wanjiru order → it moves to "In Progress"
4. Switch to Rider tab → select Kevin → see Grace Wanjiru's delivery
5. Click "Mark as Picked Up" → status badge changes
6. Click "Confirm delivered" → delivery disappears from rider queue
7. Switch to Tracking tab → type the RFX reference → Track
8. Show the timeline: New → Assigned → Picked Up → Delivered
9. Show the signature pad for proof-of-delivery confirmation
10. Say: *"The retailer gets the full audit trail. The customer can sign off. Everyone has the same ground truth."*

---

### 7:30 — Architecture + Trade-offs (P2)

> "The stack is React with Tailwind for the UI, and localStorage as the data layer. We made that choice deliberately — no backend means no deployment complexity in the prototype phase, and the storage module is designed as a drop-in swap for a real API later.
>
> Our three known trade-offs: first, localStorage doesn't sync across devices — two people on separate machines have separate datasets. We accepted it for the demo, and we've documented exactly what a backend swap would look like.
>
> Second, passwords are in plain text — zero tolerance in production, acceptable for a controlled demo.
>
> Third, the rider list is hardcoded. The fix is a riders table and a simple admin screen — we know exactly what that looks like."

**Key takeaway on slide**: *We know the weak points. We chose them deliberately. Here's the cost and the fix.*

---

### 9:00 — Roadmap (P1)

> "Week 1 of a real build: replace the storage shim with an Express/SQLite backend on Render. Every component works unchanged.
>
> Week 2: add real authentication — bcrypt, JWT, session expiry.
>
> Week 3: rider mobile app — WhatsApp Business webhook so riders get order notifications on the tool they already use, without installing anything new."

**Key takeaway on slide**: *The architecture is designed to grow. The hard parts are already solved.*

---

## Cross-exam preparation (State → Context → Evidence)

Use this format for every question:

1. **State** your answer plainly first — one sentence
2. **Context** — the reasoning behind it
3. **Evidence** — a number, a decision you made, or a test you ran

### Anticipated questions

| Question | State | Context | Evidence |
|----------|-------|---------|----------|
| Why localStorage and not a real backend? | We chose localStorage to eliminate deployment complexity in the prototype phase. | A backend would have added 2–3 days of setup (server, DB, auth) with no rubric credit for this week. | The storage module has the exact same interface as a fetch()-based client — swapping is one file change. |
| What happens if two dispatchers assign the same order simultaneously? | Right now, the last write wins. There's no conflict detection. | localStorage has no transactions. We documented this as Trade-off 4. | With a real backend: a database transaction and HTTP 409 Conflict on the second assignment. |
| How does the rider know they have a new delivery? | Currently they refresh the page or wait for the 3-second poll. | Push notifications require a backend + service worker. | Roadmap: WhatsApp Business webhook or Firebase Cloud Messaging. |
| Is the data secure? | No — passwords are in plain text in localStorage. | Acceptable for a demo; we've explicitly called this out as Trade-off 2. | Production fix: bcrypt + JWT on the server side. |
| What if the rider has no internet? | The app breaks — all data comes from localStorage which needs the browser. | This is the CDN dependency trade-off (Trade-off 5 in the Electron build). | Fix: vendor all libraries locally and use a service worker for offline caching. |

---

## If you get a question you can't answer

Say exactly this:

> *"I don't know the answer to that right now. But here's how I'd find out: [describe the experiment, measurement, or resource you'd use]."*

This is a stronger answer than guessing.
