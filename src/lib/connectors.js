// ─── Import connector layer ───────────────────────────────────────────────────
// Every order source — spreadsheet, JSON payload, future POS webhook — only
// needs to supply a thin adapter that turns its native format into an array of
// plain row objects. The shared core (findField + mapRowsToDeliveries) does the
// column matching and validation exactly once.
//
// Adding a new source = write one parse() function and add one entry to
// CONNECTORS. Nothing else in the app needs to change.

import * as XLSX from "xlsx";
import { FIELD_ALIASES } from "../constants";

// ── Column resolver ────────────────────────────────────────────────────────────
/**
 * Search a row object for a field using alias matching.
 * Column names are normalised to lowercase letters only before comparison.
 *
 * @param {Record<string, unknown>} row
 * @param {"customer"|"phone"|"address"|"item"} key
 * @returns {string}
 */
export function findField(row, key) {
  const candidates = FIELD_ALIASES[key];
  for (const [k, v] of Object.entries(row)) {
    const nk = k.toLowerCase().replace(/[^a-z]/g, "");
    if (candidates.some((c) => nk.includes(c))) return String(v ?? "").trim();
  }
  return "";
}

// ── Shared mapping / validation ────────────────────────────────────────────────
/**
 * Map raw rows from any source into the canonical delivery record shape,
 * separating valid records from ones with missing required fields.
 *
 * @param {Record<string, unknown>[]} rows
 * @returns {{ valid: object[], invalid: {row: number, missing: string[]}[] }}
 */
export function mapRowsToDeliveries(rows) {
  const valid = [];
  const invalid = [];
  rows.forEach((row, i) => {
    const record = {
      customer: findField(row, "customer"),
      phone: findField(row, "phone"),
      address: findField(row, "address"),
      item: findField(row, "item"),
    };
    const missing = Object.entries(record)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (missing.length) {
      invalid.push({ row: i + 2, missing }); // +2 because row 1 is the header
    } else {
      valid.push(record);
    }
  });
  return { valid, invalid };
}

// ── Connector registry ─────────────────────────────────────────────────────────
export const CONNECTORS = {
  spreadsheet: {
    label: "Spreadsheet",
    icon: "FileSpreadsheet",
    description:
      "Upload an .xlsx, .xls, or .csv export from your POS or a manual sheet.",
    parse: async (file) => {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      return mapRowsToDeliveries(rows);
    },
  },

  json: {
    label: "JSON payload",
    icon: "Braces",
    description:
      "Paste a JSON array — the same shape a POS or e-commerce webhook would send.",
    parse: async (text) => {
      const data = JSON.parse(text);
      const rows = Array.isArray(data) ? data : [data];
      return mapRowsToDeliveries(rows);
    },
  },
};
