import { STATUS_COLOR } from "../constants";

export function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        STATUS_COLOR[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
      {text}
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
