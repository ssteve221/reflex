import { useState } from "react";
import { Phone, MapPin, Check } from "lucide-react";
import { StatusBadge, EmptyState } from "./ui";
import { RIDERS, STATUS_FLOW } from "../constants";

export function RiderView({ deliveries, onAdvance }) {
  const [selectedRider, setSelectedRider] = useState(RIDERS[0]);
  const mine = deliveries.filter(
    (d) => d.rider === selectedRider && d.status !== "Delivered"
  );

  return (
    <div>
      {/* Rider selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Signed in as:</span>
        <select
          id="riderSelect"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedRider}
          onChange={(e) => setSelectedRider(e.target.value)}
        >
          {RIDERS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {mine.length === 0 ? (
        <EmptyState text="No active deliveries assigned to you." />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {mine.map((d) => {
            const nextIdx = Math.min(
              STATUS_FLOW.indexOf(d.status) + 1,
              STATUS_FLOW.length - 1
            );
            const nextStatus = STATUS_FLOW[nextIdx];
            const isFinal = d.status === "Delivered";
            const isDeliveryStep = nextStatus === "Delivered";

            return (
              <div
                key={d.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-400">{d.id}</span>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm font-medium">{d.customer}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3" /> {d.phone}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {d.address}
                </p>
                <button
                  id={`advance-${d.id}`}
                  disabled={isFinal}
                  onClick={() => onAdvance(d.id)}
                  className={`w-full flex items-center justify-center gap-1.5 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium py-2 rounded ${
                    isDeliveryStep
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-blue-900 hover:bg-blue-800"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {isDeliveryStep
                    ? "Confirm delivered"
                    : `Mark as ${nextStatus}`}
                </button>
                {isDeliveryStep && (
                  <p className="text-xs text-gray-400 mt-2">
                    Once you confirm, the customer can also sign off on the
                    tracking page.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
