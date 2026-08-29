import { Clock, MapPin, Check } from "lucide-react";
import { StatusBadge, EmptyState } from "./ui";
import { RIDERS } from "../constants";
import { timeAgo } from "../lib/utils";

export function DispatcherView({ deliveries, onAssign }) {
  const open = deliveries.filter((d) => d.status === "New");
  const inProgress = deliveries.filter((d) => d.status !== "New");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── Open requests ── */}
      <div>
        <h2 className="font-semibold text-blue-900 mb-4">
          Open requests ({open.length})
        </h2>
        {open.length === 0 ? (
          <EmptyState text="No open requests. All caught up." />
        ) : (
          <div className="space-y-2">
            {open.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-400">{d.id}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(d.createdAt)}
                  </span>
                </div>
                <p className="text-sm font-medium">{d.customer}</p>
                {d.retailerName && (
                  <p className="text-xs text-gray-400 mb-1">{d.retailerName}</p>
                )}
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {d.address}
                </p>
                <select
                  id={`assignRider-${d.id}`}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                  defaultValue=""
                  onChange={(e) =>
                    e.target.value && onAssign(d.id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Assign a rider…
                  </option>
                  {RIDERS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── In-progress ── */}
      <div>
        <h2 className="font-semibold text-blue-900 mb-4">
          In progress ({inProgress.length})
        </h2>
        {inProgress.length === 0 ? (
          <EmptyState text="Nothing assigned yet." />
        ) : (
          <div className="space-y-2">
            {inProgress.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{d.customer}</p>
                  <p className="text-xs text-gray-400">Rider: {d.rider}</p>
                  {d.pod && (
                    <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Customer signed off
                    </p>
                  )}
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
