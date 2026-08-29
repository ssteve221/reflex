import { useState } from "react";
import { Package, ClipboardList, Truck, Search, RefreshCw, LogOut } from "lucide-react";
import { useDeliveries } from "./hooks/useDeliveries";
import { LoginView } from "./components/LoginView";
import { RetailerView } from "./components/RetailerView";
import { DispatcherView } from "./components/DispatcherView";
import { RiderView } from "./components/RiderView";
import { TrackingView } from "./components/TrackingView";

const TABS = [
  { id: "retailer",   label: "Retailer",        Icon: Package },
  { id: "dispatcher", label: "Dispatcher",       Icon: ClipboardList },
  { id: "rider",      label: "Rider",            Icon: Truck },
  { id: "tracking",   label: "Track a delivery", Icon: Search },
];

export default function App() {
  const [role, setRole] = useState("retailer");

  const {
    deliveries,
    session,
    loading,
    error,
    load,
    signUp,
    signIn,
    logOut,
    addDelivery,
    addDeliveries,
    assignRider,
    advanceStatus,
    confirmDelivery,
  } = useDeliveries();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Header ── */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Brand mark */}
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-orange-500" />
              <div className="w-3 h-3 bg-blue-900" />
              <div className="w-3 h-3 bg-sky-400" />
            </div>
            <h1 className="text-lg font-bold text-blue-900">Reflex</h1>
            <span className="text-sm text-gray-400">delivery management</span>
          </div>

          <div className="flex items-center gap-3">
            {role === "retailer" && session && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>
                  Signed in as{" "}
                  <span className="font-medium text-gray-700">
                    {session.businessName}
                  </span>
                </span>
                <button
                  id="logoutBtn"
                  onClick={logOut}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            )}
            <button
              id="refreshBtn"
              onClick={load}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </header>

        {/* ── Nav tabs ── */}
        <nav className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              id={`tab-${id}`}
              onClick={() => setRole(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                role === id
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* ── Views ── */}
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : (
          <>
            {role === "retailer" &&
              (session ? (
                <RetailerView
                  deliveries={deliveries.filter(
                    (d) => d.retailerId === session.retailerId
                  )}
                  onAdd={addDelivery}
                  onImport={addDeliveries}
                />
              ) : (
                <LoginView onSignIn={signIn} onSignUp={signUp} />
              ))}

            {role === "dispatcher" && (
              <DispatcherView deliveries={deliveries} onAssign={assignRider} />
            )}

            {role === "rider" && (
              <RiderView deliveries={deliveries} onAdvance={advanceStatus} />
            )}

            {role === "tracking" && (
              <TrackingView
                deliveries={deliveries}
                onConfirm={confirmDelivery}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
