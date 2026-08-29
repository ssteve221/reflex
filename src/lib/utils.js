// ─── Utility helpers ──────────────────────────────────────────────────────────

/** Generate a human-readable delivery reference like RFX-AB12C. */
export function genRef() {
  return "RFX-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

/** Generate a short random ID for user accounts. */
export function genId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Return a human-readable "time ago" string from a Unix timestamp.
 * @param {number} ts — timestamp in milliseconds
 */
export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
