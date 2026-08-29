import { useState } from "react";
import { Field } from "./ui";

export function LoginView({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ businessName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async () => {
    const errs = {};
    if (mode === "signup" && !form.businessName.trim())
      errs.businessName = "Enter your business name";
    if (!form.email.trim()) errs.email = "Enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Enter a password";
    else if (mode === "signup" && form.password.length < 4)
      errs.password = "Use at least 4 characters";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError("");
    const result =
      mode === "signup" ? await onSignUp(form) : await onSignIn(form);
    if (result?.error) setSubmitError(result.error);
  };

  const inputCls =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-blue-900 mb-1">
          {mode === "signin" ? "Retailer sign in" : "Create a retailer account"}
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          {mode === "signin"
            ? "Sign in to log and track your deliveries."
            : "Set up your business to start logging deliveries."}
        </p>

        <div className="space-y-3">
          {mode === "signup" && (
            <Field label="Business name" error={errors.businessName}>
              <input
                id="businessName"
                className={inputCls}
                value={form.businessName}
                onChange={update("businessName")}
                placeholder="Nairobi Electronics Ltd"
              />
            </Field>
          )}

          <Field label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              className={inputCls}
              value={form.email}
              onChange={update("email")}
              placeholder="owner@shop.co.ke"
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <input
              id="password"
              type="password"
              className={inputCls}
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </Field>

          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}

          <button
            id="authSubmit"
            onClick={submit}
            className="w-full bg-blue-900 text-white text-sm font-medium py-2 rounded hover:bg-blue-800"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {mode === "signin" ? "New retailer?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setErrors({});
              setSubmitError("");
            }}
            className="text-blue-900 font-medium hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
