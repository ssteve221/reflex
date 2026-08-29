import { describe, it, expect } from "vitest";
import { STATUS_FLOW } from "../../src/constants";
import { genRef, genId, timeAgo } from "../../src/lib/utils";

// ── STATUS_FLOW ──────────────────────────────────────────────────────────────

describe("STATUS_FLOW", () => {
  it("contains exactly 5 statuses in the correct order", () => {
    expect(STATUS_FLOW).toEqual([
      "New",
      "Assigned",
      "Picked Up",
      "In Transit",
      "Delivered",
    ]);
  });

  it("New is the first status", () => {
    expect(STATUS_FLOW[0]).toBe("New");
  });

  it("Delivered is the final status", () => {
    expect(STATUS_FLOW[STATUS_FLOW.length - 1]).toBe("Delivered");
  });
});

// ── Status progression logic (mirrors advanceStatus in useDeliveries) ─────────
// We test the pure logic here so we don't need to render a React component.

function advanceStatus(currentStatus) {
  const idx = STATUS_FLOW.indexOf(currentStatus);
  return STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
}

describe("advanceStatus logic", () => {
  it("New → Assigned", () => {
    expect(advanceStatus("New")).toBe("Assigned");
  });

  it("Assigned → Picked Up", () => {
    expect(advanceStatus("Assigned")).toBe("Picked Up");
  });

  it("Picked Up → In Transit", () => {
    expect(advanceStatus("Picked Up")).toBe("In Transit");
  });

  it("In Transit → Delivered", () => {
    expect(advanceStatus("In Transit")).toBe("Delivered");
  });

  it("Delivered stays at Delivered (no progression past final)", () => {
    expect(advanceStatus("Delivered")).toBe("Delivered");
  });

  it("covers the full flow in sequence", () => {
    let status = "New";
    for (let i = 0; i < STATUS_FLOW.length - 1; i++) {
      status = advanceStatus(status);
    }
    expect(status).toBe("Delivered");
  });
});

// ── genRef ───────────────────────────────────────────────────────────────────

describe("genRef", () => {
  it("starts with RFX-", () => {
    expect(genRef()).toMatch(/^RFX-/);
  });

  it("produces unique references across many calls", () => {
    const refs = new Set(Array.from({ length: 100 }, genRef));
    expect(refs.size).toBe(100);
  });

  it("has uppercase alphanumeric chars after the prefix", () => {
    const ref = genRef();
    const suffix = ref.slice(4);
    expect(suffix).toMatch(/^[A-Z0-9]+$/);
  });
});

// ── genId ────────────────────────────────────────────────────────────────────

describe("genId", () => {
  it("returns a non-empty string", () => {
    expect(genId()).toBeTruthy();
  });

  it("produces unique IDs across many calls", () => {
    const ids = new Set(Array.from({ length: 100 }, genId));
    expect(ids.size).toBe(100);
  });
});

// ── timeAgo ──────────────────────────────────────────────────────────────────

describe("timeAgo", () => {
  it("returns 'just now' for timestamps less than 60s ago", () => {
    expect(timeAgo(Date.now() - 5000)).toBe("just now");
  });

  it("returns minutes for timestamps between 1m and 1h ago", () => {
    expect(timeAgo(Date.now() - 5 * 60 * 1000)).toBe("5m ago");
    expect(timeAgo(Date.now() - 59 * 60 * 1000)).toBe("59m ago");
  });

  it("returns hours for timestamps more than 1h ago", () => {
    expect(timeAgo(Date.now() - 2 * 60 * 60 * 1000)).toBe("2h ago");
  });
});
