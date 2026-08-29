import { describe, it, expect } from "vitest";
import { findField, mapRowsToDeliveries } from "../../src/lib/connectors";

// ── findField ────────────────────────────────────────────────────────────────

describe("findField", () => {
  it("matches exact key names", () => {
    const row = { customer: "Grace", phone: "0712345678", address: "Nairobi", item: "TV" };
    expect(findField(row, "customer")).toBe("Grace");
    expect(findField(row, "phone")).toBe("0712345678");
    expect(findField(row, "address")).toBe("Nairobi");
    expect(findField(row, "item")).toBe("TV");
  });

  it("matches aliased column names", () => {
    const row = {
      "Customer Name": "Grace",
      "Mobile Number": "0712345678",
      "Delivery Address": "Ngong Road",
      "Product Description": "1x TV",
    };
    expect(findField(row, "customer")).toBe("Grace");
    expect(findField(row, "phone")).toBe("0712345678");
    expect(findField(row, "address")).toBe("Ngong Road");
    expect(findField(row, "item")).toBe("1x TV");
  });

  it("returns empty string when no matching column", () => {
    expect(findField({ x: "y" }, "customer")).toBe("");
  });

  it("trims whitespace from values", () => {
    expect(findField({ customer: "  Grace  " }, "customer")).toBe("Grace");
  });

  it("converts numeric values to string", () => {
    expect(findField({ phone: 712345678 }, "phone")).toBe("712345678");
  });

  it("handles null / undefined values gracefully", () => {
    expect(findField({ customer: null }, "customer")).toBe("");
    expect(findField({ customer: undefined }, "customer")).toBe("");
  });
});

// ── mapRowsToDeliveries ──────────────────────────────────────────────────────

describe("mapRowsToDeliveries", () => {
  const validRow = {
    customer: "Grace Wanjiru",
    phone: "+254712345678",
    address: "14 Ngong Road",
    item: "1x LED TV",
  };

  it("accepts a fully valid row", () => {
    const { valid, invalid } = mapRowsToDeliveries([validRow]);
    expect(valid).toHaveLength(1);
    expect(invalid).toHaveLength(0);
    expect(valid[0]).toMatchObject(validRow);
  });

  it("rejects a row missing required fields", () => {
    const { valid, invalid } = mapRowsToDeliveries([
      { customer: "Grace", phone: "", address: "Nairobi", item: "" },
    ]);
    expect(valid).toHaveLength(0);
    expect(invalid).toHaveLength(1);
    expect(invalid[0].missing).toContain("phone");
    expect(invalid[0].missing).toContain("item");
  });

  it("reports correct spreadsheet row number (1-indexed, accounting for header)", () => {
    const { invalid } = mapRowsToDeliveries([
      { customer: "Grace" }, // row index 0 → reported as row 2
    ]);
    expect(invalid[0].row).toBe(2);
  });

  it("handles a mix of valid and invalid rows", () => {
    const { valid, invalid } = mapRowsToDeliveries([
      validRow,
      { customer: "Bob" }, // missing phone, address, item
      { ...validRow, customer: "Alice" },
    ]);
    expect(valid).toHaveLength(2);
    expect(invalid).toHaveLength(1);
  });

  it("returns empty arrays for zero rows", () => {
    const { valid, invalid } = mapRowsToDeliveries([]);
    expect(valid).toHaveLength(0);
    expect(invalid).toHaveLength(0);
  });
});
