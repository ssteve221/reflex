# Reflex — Presentation Deck Outline

> **Rule**: One key takeaway per slide. If a slide is doing two jobs, split it.

---

## Slide 1 — Title

**Takeaway**: *Reflex — Delivery Management for Small Kenyan Retailers*

Content: Team name, date, course

---

## Slide 2 — The Problem

**Takeaway**: *Small retailers manage deliveries over WhatsApp — no record, no visibility, no proof.*

Content:
- Quote / real scenario: "I sent Kevin with the TV. He says he delivered it. The customer says he didn't."
- Three pain points: no assignment record, no status visibility, no proof of delivery
- Who it affects: electronics shops, pharmacies, hardware stores

Speaker notes: Lead with the human cost, not the technical solution.

---

## Slide 3 — The Users

**Takeaway**: *Three people, one shared system: Retailer, Dispatcher, Rider.*

Content:
- Retailer staff → logs the request
- Dispatcher → assigns to a rider
- Rider → updates status on the ground
- (Customer) → tracks via reference number

Speaker notes: Make clear that each role sees only what they need. No noise.

---

## Slide 4 — The Solution

**Takeaway**: *Reflex replaces the WhatsApp group with a structured audit trail — from request to proof of delivery.*

Content:
- One workflow: Log → Assign → Pick Up → Deliver → Confirm
- Real-time status visible to all roles
- Proof-of-delivery with customer signature

Speaker notes: Don't explain the UI yet — that's the demo. Just land the "what" and "why now" on this slide.

---

## Slide 5 — Architecture

**Takeaway**: *React SPA + localStorage: intentionally simple, designed to scale.*

Content:
- Diagram: Browser → React components → useDeliveries hook → storage.js → localStorage
- Arrow labeled "swap this for fetch() to add a backend"
- The connector layer (spreadsheet / JSON → same delivery schema)
- 3-second polling for cross-tab sync

Speaker notes: Emphasise the deliberate modularity. The storage module is a seam.

---

## Slide 6 — Trade-offs

**Takeaway**: *We simplified three things on purpose. Here's the cost and the fix for each.*

Content (table or 3-column layout):

| Simplification | Cost | Fix |
|---|---|---|
| localStorage, no backend | No cross-device sync | Swap storage.js for a fetch() layer |
| Plain-text passwords | Zero production security | bcrypt + JWT on the server |
| Hardcoded riders | Must edit code to add/remove riders | Riders table + admin UI |

Speaker notes: Whoever owns this slide should be able to defend each row live.

---

## Slide 7 — Live Demo

**Takeaway**: *Watch the full lifecycle — from request to signed proof of delivery.*

Content: just the three role tabs on screen — no bullet points on the slide during demo

Speaker notes: This is the P3 slot. Keep the demo under 4 minutes. Practice the exact click sequence.

---

## Slide 8 — Roadmap

**Takeaway**: *The architecture is ready for production. Three weeks gets us there.*

Content:
- Week 1: Replace storage shim with Express/SQLite backend on Render
- Week 2: Real auth (bcrypt + JWT), rider management CRUD
- Week 3: Rider push notifications via WhatsApp Business webhook

Speaker notes: The roadmap should feel inevitable, not aspirational. Show that you know the exact next step.

---

## Slide 9 — Q&A / Cross-exam

**Takeaway**: *We know the weak points. Ask us anything.*

Content: Just the team names and their domains

Speaker notes: Every team member should know which questions they're fielding. Refer to DEMO_SCRIPT.md for the State → Context → Evidence prep.

---

## Slide design notes

- One sentence per slide maximum on the visual (the rest goes in speaker notes)
- Use the Reflex brand colors: orange `#f97316`, navy `#1e3a8a`, sky `#38bdf8`
- Architecture diagram should be hand-drawn style (Excalidraw) for authenticity
- No bullet-point walls. A non-technical stakeholder should follow every slide without reading dense text.
