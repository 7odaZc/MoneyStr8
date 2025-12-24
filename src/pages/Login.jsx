import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextInput from "../components/ui/TextInput";
import Alert from "../components/ui/Alert";
import FadeIn from "../components/ui/FadeIn";
import { useAuth } from "../context/AuthContext";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function Login() {
  const { login, isAuthed } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = loc.state?.from || "/dashboard";

  useEffect(() => {
    if (isAuthed) nav(from, { replace: true });
  }, [isAuthed, from, nav]);

  function validate() {
    const errs = {};
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
      login(form);
      nav(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-4 py-10 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-sm text-white/70 hover:text-white underline">
            ← Back to Home
          </Link>
        </div>

        <FadeIn index={0}>
          <Card className="p-6">
            <h1 className="text-2xl font-extrabold">Login</h1>
            <p className="mt-1 text-sm text-white/60">Use your email and password to continue.</p>

            {error ? (
              <div className="mt-4">
                <Alert title="Login failed">{error}</Alert>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                error={form.password && errs.password ? errs.password : ""}
                autoComplete="current-password"
              />

              <Button type="submit" disabled={submitting || Object.keys(errs).length > 0} className="w-full">
                {submitting ? "Logging in…" : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-white/70">
              Don’t have an account?{" "}
              <Link to="/register" className="font-semibold text-emerald-300 hover:text-emerald-200 underline">
                Register
              </Link>
            </div>
          </Card>
        </FadeIn>

        <div className="mt-4 text-xs text-white/50">
  Auth is simulated using localStorage.
  <br />
  Demo admin: admin@moneystr8.com / admin123 • Demo user: user@moneystr8.com / user123
</div>

      </div>
    </div>
  );
}
