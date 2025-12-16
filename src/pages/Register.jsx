import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextInput from "../components/ui/TextInput";
import Alert from "../components/ui/Alert";
import { useAuth } from "../context/AuthContext";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function Register() {
  const { register, isAuthed } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed) nav("/dashboard", { replace: true });
  }, [isAuthed, nav]);

  function validate() {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = "Enter your name.";
    if (!isEmail(form.email)) errs.email = "Enter a valid email.";
    if (!form.password || form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  const errs = validate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      register(form);
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#071B15] px-4 py-10 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-sm text-white/70 hover:text-white underline">
            ← Back to Home
          </Link>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-extrabold">Register</h1>
          <p className="mt-1 text-sm text-white/60">Create an account to start tracking.</p>

          {error ? (
            <div className="mt-4">
              <Alert title="Registration failed">{error}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <TextInput
              label="Name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              error={form.name && errs.name ? errs.name : ""}
              autoComplete="name"
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              error={form.email && errs.email ? errs.email : ""}
              autoComplete="email"
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              error={form.password && errs.password ? errs.password : ""}
              autoComplete="new-password"
            />

            <Button type="submit" disabled={submitting || Object.keys(errs).length > 0} className="w-full">
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200 underline">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
