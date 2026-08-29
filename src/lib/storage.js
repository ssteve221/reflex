// ─── localStorage shim ───────────────────────────────────────────────────────
// Wraps the browser's localStorage behind a small Promise-based API so it is
// a drop-in replacement for any future server-backed store (swap this file for
// a fetch() layer and the rest of the app doesn't change).
//
// Trade-off: localStorage is per-browser-profile, per-origin. Two people on
// two different machines share NOTHING. That's acceptable for a prototype where
// all roles (Retailer / Dispatcher / Rider) are demonstrated from one browser.
// See docs/TRADE_OFFS.md for the full analysis.

const PREFIX = "reflex:";

export const storage = {
  /** @returns {Promise<{key: string, value: string} | null>} */
  get(key) {
    return Promise.resolve().then(() => {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : { key, value: raw };
    });
  },

  /** @returns {Promise<{key: string, value: string}>} */
  set(key, value) {
    return Promise.resolve().then(() => {
      localStorage.setItem(PREFIX + key, value);
      return { key, value };
    });
  },

  /** @returns {Promise<{key: string, deleted: boolean}>} */
  delete(key) {
    return Promise.resolve().then(() => {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true };
    });
  },
};
