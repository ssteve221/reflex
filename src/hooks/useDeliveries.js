import { useState, useEffect, useCallback, useRef } from "react";
import { storage } from "../lib/storage";
import { genRef, genId } from "../lib/utils";
import { STATUS_FLOW } from "../constants";

/**
 * useDeliveries — central state + persistence hook.
 *
 * Manages the full delivery and account lifecycle:
 *  - Loads from localStorage on mount, then polls every 3 s
 *  - Exposes typed action functions that update state and persist atomically
 *  - Guards against poll races on in-flight writes (lastWriteRef)
 *
 * Trade-off: 3-second polling simulates real-time on a single browser but
 * won't sync across separate devices. See docs/TRADE_OFFS.md for details.
 */
export function useDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lastWriteRef = useRef(0);

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const [delRes, accRes, sessRes] = await Promise.all([
        storage.get("deliveries").catch(() => null),
        storage.get("retailer_accounts").catch(() => null),
        storage.get("session").catch(() => null),
      ]);

      // Skip overwriting deliveries if we just wrote (avoids stale-state flash)
      if (Date.now() - lastWriteRef.current > 2000) {
        setDeliveries(delRes ? JSON.parse(delRes.value) : []);
      }
      setAccounts(accRes ? JSON.parse(accRes.value) : []);
      setSession((prev) => prev || (sessRes ? JSON.parse(sessRes.value) : null));
    } catch {
      // Silently keep whatever we already have
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [load]);

  // ── Persistence helpers ─────────────────────────────────────────────────────
  const save = async (next) => {
    lastWriteRef.current = Date.now();
    setDeliveries(next);
    try {
      await storage.set("deliveries", JSON.stringify(next));
      lastWriteRef.current = Date.now();
    } catch {
      setError("Could not save — try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const saveAccounts = async (next) => {
    setAccounts(next);
    await storage.set("retailer_accounts", JSON.stringify(next));
  };

  // ── Auth ────────────────────────────────────────────────────────────────────
  const signUp = async ({ businessName, email, password }) => {
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with that email already exists." };
    }
    const account = { id: genId(), businessName, email, password };
    await saveAccounts([...accounts, account]);
    const s = {
      retailerId: account.id,
      businessName: account.businessName,
      email: account.email,
    };
    setSession(s);
    await storage.set("session", JSON.stringify(s));
    return {};
  };

  const signIn = async ({ email, password }) => {
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (!account) return { error: "No account found with that email." };
    if (account.password !== password) return { error: "Incorrect password." };
    const s = {
      retailerId: account.id,
      businessName: account.businessName,
      email: account.email,
    };
    setSession(s);
    await storage.set("session", JSON.stringify(s));
    return {};
  };

  const logOut = async () => {
    setSession(null);
    await storage.delete("session").catch(() => {});
  };

  // ── Delivery actions ────────────────────────────────────────────────────────
  const addDelivery = (d) => {
    const record = {
      id: genRef(),
      customer: d.customer,
      phone: d.phone,
      address: d.address,
      item: d.item,
      status: "New",
      rider: null,
      createdAt: Date.now(),
      history: [{ status: "New", at: Date.now() }],
      pod: null,
      retailerId: session?.retailerId || null,
      retailerName: session?.businessName || null,
    };
    save([record, ...deliveries]);
  };

  const addDeliveries = (records) => {
    const now = Date.now();
    const made = records.map((d) => ({
      id: genRef(),
      customer: d.customer,
      phone: d.phone,
      address: d.address,
      item: d.item,
      status: "New",
      rider: null,
      createdAt: now,
      history: [{ status: "New", at: now }],
      pod: null,
      retailerId: session?.retailerId || null,
      retailerName: session?.businessName || null,
    }));
    save([...made, ...deliveries]);
  };

  const assignRider = (id, rider) => {
    const next = deliveries.map((d) =>
      d.id === id
        ? {
            ...d,
            rider,
            status: "Assigned",
            history: [
              ...d.history,
              { status: "Assigned", at: Date.now() },
            ],
          }
        : d
    );
    save(next);
  };

  const advanceStatus = (id) => {
    const next = deliveries.map((d) => {
      if (d.id !== id) return d;
      const idx = STATUS_FLOW.indexOf(d.status);
      const newStatus = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
      return {
        ...d,
        status: newStatus,
        history: [...d.history, { status: newStatus, at: Date.now() }],
      };
    });
    save(next);
  };

  const confirmDelivery = (id, condition, signature) => {
    const next = deliveries.map((d) =>
      d.id === id
        ? {
            ...d,
            pod: {
              confirmedBy: "recipient",
              condition,
              signature,
              confirmedAt: Date.now(),
            },
          }
        : d
    );
    save(next);
  };

  return {
    deliveries,
    accounts,
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
  };
}
