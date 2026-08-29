import { useState, useRef } from "react";
import { Plus, Check } from "lucide-react";
import { StatusBadge, EmptyState, Field } from "./ui";
import ImportPanel from "./ImportPanel";

export function RetailerView({ deliveries, onAdd, onImport }) {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    address: "",
    item: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = () => {
    const errs = {};
    if (!form.customer.trim()) errs.customer = "Enter a customer name";
    if (!form.phone.trim()) errs.phone = "Enter a phone number";
    if (!form.address.trim()) errs.address = "Enter a delivery address";
    if (!form.item.trim()) errs.item = "Enter an item description";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onAdd(form);
    setForm({ customer: "", phone: "", address: "", item: "" });
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const inputCls =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── Left column: form + import ── */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Log a delivery
          </h2>
          <div className="space-y-3">
            <Field label="Customer name" error={errors.customer}>
              <input
                id="customerName"
                className={inputCls}
                value={form.customer}
                onChange={update("customer")}
                placeholder="Grace Wanjiru"
              />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input
                id="customerPhone"
                className={inputCls}
                value={form.phone}
                onChange={update("phone")}
                placeholder="+254 7XX XXX XXX"
              />
            </Field>
            <Field label="Delivery address" error={errors.address}>
              <input
                id="deliveryAddress"
                className={inputCls}
                value={form.address}
                onChange={update("address")}
                placeholder="14 Ngong Road, Nairobi"
              />
            </Field>
            <Field label="Item description" error={errors.item}>
              <input
                id="itemDescription"
                className={inputCls}
                value={form.item}
                onChange={update("item")}
                placeholder="1x LED TV, 43-inch"
              />
            </Field>
            <button
              id="logDeliveryBtn"
              onClick={submit}
              className="w-full bg-blue-900 text-white text-sm font-medium py-2 rounded hover:bg-blue-800 flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4" /> Delivery logged!
                </>
              ) : (
                "Log delivery"
              )}
            </button>
          </div>
        </div>

        <ImportPanel onImport={onImport} />
      </div>

      {/* ── Right column: delivery list ── */}
      <div>
        <h2 className="font-semibold text-blue-900 mb-4">Your deliveries</h2>
        {deliveries.length === 0 ? (
          <EmptyState text="No deliveries logged yet. Add one to get started." />
        ) : (
          <div className="space-y-2">
            {deliveries.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{d.id}</span>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm font-medium mt-1">{d.customer}</p>
                <p className="text-xs text-gray-500">{d.item}</p>
                {d.rider && (
                  <p className="text-xs text-gray-400 mt-1">Rider: {d.rider}</p>
                )}
                {d.pod && (
                  <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Signed off by customer ·{" "}
                    {d.pod.condition === "good"
                      ? "good condition"
                      : "reported damaged"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
