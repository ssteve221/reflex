import { useState, useRef } from "react";
import { Check } from "lucide-react";
import { StatusBadge } from "./ui";
import SignaturePad from "./SignaturePad";
import { timeAgo } from "../lib/utils";

/** Confirmation form shown on the tracking page after delivery. */
function DeliveryConfirmForm({ deliveryId, onConfirm }) {
  const [condition, setCondition] = useState(null);
  const [error, setError] = useState("");
  const padRef = useRef(null);

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="text-sm font-medium text-gray-800 mb-2">
        Confirm you received this order
      </p>

      <div className="flex gap-2 mb-3">
        <button
          id="conditionGood"
          onClick={() => setCondition("good")}
          className={`flex-1 text-sm py-1.5 rounded border ${
            condition === "good"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Good condition
        </button>
        <button
          id="conditionDamaged"
          onClick={() => setCondition("damaged")}
          className={`flex-1 text-sm py-1.5 rounded border ${
            condition === "damaged"
              ? "bg-red-600 text-white border-red-600"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Item damaged
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-1">Sign below to confirm</p>
      <SignaturePad ref={padRef} />

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <button
        id="confirmDeliveryBtn"
        onClick={() => {
          if (!condition) {
            setError("Select the item's condition first.");
            return;
          }
          if (!padRef.current || padRef.current.isEmpty()) {
            setError("Sign in the box above to confirm.");
            return;
          }
          setError("");
          onConfirm(deliveryId, condition, padRef.current.toDataURL());
        }}
        className="w-full mt-3 bg-blue-900 text-white text-sm font-medium py-2 rounded hover:bg-blue-800"
      >
        Confirm delivery
      </button>
    </div>
  );
}

/** Public tracking view — search by reference, show timeline, capture POD. */
export function TrackingView({ deliveries, onConfirm }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [foundId, setFoundId] = useState(null);

  // Derive from live deliveries so a confirmation shows up without re-search
  const found = foundId ? deliveries.find((x) => x.id === foundId) : null;

  const search = () => {
    if (!query.trim()) {
      setError("Enter a delivery reference (e.g. RFX-AB12C)");
      setFoundId(null);
      return;
    }
    const d = deliveries.find(
      (x) => x.id.toLowerCase() === query.trim().toLowerCase()
    );
    if (!d) {
      setError("No delivery found with that reference.");
      setFoundId(null);
      return;
    }
    setError("");
    setFoundId(d.id);
  };

  return (
    <div className="max-w-md">
      <h2 className="font-semibold text-blue-900 mb-4">Track a delivery</h2>

      <div className="flex gap-2 mb-2">
        <input
          id="trackingQuery"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="RFX-AB12C"
        />
        <button
          id="trackBtn"
          onClick={search}
          className="bg-blue-900 text-white text-sm font-medium px-4 rounded hover:bg-blue-800"
        >
          Track
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {found && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-gray-400">{found.id}</span>
            <StatusBadge status={found.status} />
          </div>
          <p className="text-sm font-medium">{found.item}</p>
          <p className="text-xs text-gray-500 mb-4">to {found.address}</p>

          {/* Status timeline */}
          <div className="space-y-2 mb-2">
            {found.history.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    i === found.history.length - 1
                      ? "bg-blue-900"
                      : "bg-gray-300"
                  }`}
                />
                <span
                  className={
                    i === found.history.length - 1
                      ? "font-medium text-gray-800"
                      : "text-gray-400"
                  }
                >
                  {h.status}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">{timeAgo(h.at)}</span>
              </div>
            ))}
          </div>

          {/* POD capture */}
          {found.status === "Delivered" && !found.pod && (
            <DeliveryConfirmForm
              deliveryId={found.id}
              onConfirm={onConfirm}
            />
          )}

          {/* POD confirmed */}
          {found.pod && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-xs font-medium text-emerald-700 flex items-center gap-1 mb-1">
                <Check className="w-3.5 h-3.5" /> Confirmed by recipient
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Condition:{" "}
                {found.pod.condition === "good"
                  ? "Good condition"
                  : "Reported damaged"}{" "}
                · {timeAgo(found.pod.confirmedAt)}
              </p>
              {found.pod.signature && (
                <img
                  src={found.pod.signature}
                  alt="Recipient signature"
                  className="border border-gray-200 rounded bg-white h-16"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
