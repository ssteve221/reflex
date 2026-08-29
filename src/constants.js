// ─── Application-wide constants ─────────────────────────────────────────────
// Keep all shared constants here so every component reads from a single
// source of truth, and tests can import them without pulling in React.

export const RIDERS = ["Kevin", "Amina", "John"];

export const STATUS_FLOW = [
  "New",
  "Assigned",
  "Picked Up",
  "In Transit",
  "Delivered",
];

export const STATUS_COLOR = {
  New: "bg-gray-100 text-gray-700",
  Assigned: "bg-blue-100 text-blue-700",
  "Picked Up": "bg-amber-100 text-amber-700",
  "In Transit": "bg-orange-100 text-orange-700",
  Delivered: "bg-emerald-100 text-emerald-700",
};

// Column-name aliases recognised from any import source (spreadsheet / JSON).
// Adding a new alias here is the only change needed to handle a new POS export
// format — nothing else in the pipeline has to change.
export const FIELD_ALIASES = {
  customer: ["customer", "customername", "name", "client", "recipient"],
  phone: ["phone", "phonenumber", "mobile", "tel", "contact"],
  address: ["address", "deliveryaddress", "location"],
  item: ["item", "itemdescription", "description", "product", "order"],
};
