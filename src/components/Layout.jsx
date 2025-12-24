import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg w-full transition text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
         ${isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`
      }
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
    </NavLink>
  );
}

export default function Layout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useSettings();
  const navigate = useNavigate();

  // Brand logo should always take you to the main landing page.
  const homePath = "/";

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-[color:var(--bg)]"
      >
        Skip to content
      </a>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[color:var(--bg-header)] px-4 py-3 backdrop-blur md:hidden">
        <button
          aria-label="Open navigation"
          aria-controls="primary-navigation"
          aria-expanded={open}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            menu
          </span>
        </button>

        <div className="min-w-0 flex items-center gap-3">
          <Link
            to={homePath}
            aria-label="MoneyStr8 home"
            className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <img src="/Logo.png" alt="MoneyStr8" className="h-8 w-auto" />
          </Link>

          <div className="min-w-0">
            <div className="truncate text-base font-extrabold">{title || "MoneyStr8"}</div>
            <div className="truncate text-xs text-white/60">{user?.email || ""}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            onClick={() => setTheme(nextTheme)}
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
          <button
            aria-label="Go to dashboard"
            onClick={() => navigate("/dashboard")}
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-white/10 p-2 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              dashboard
            </span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        id="primary-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[color:var(--sidebar)] p-5 transition-transform md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"} md:fixed`}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between md:justify-start">
          <Link
            to={homePath}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="MoneyStr8 home"
          >
            <img src="/Logo.png" alt="MoneyStr8" className="h-9 w-auto" />
            <span className="sr-only">MoneyStr8</span>
          </Link>

          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            type="button"
            className="rounded-lg bg-white/10 p-2 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="mt-2 text-xs text-white/60">
          {user?.name ? <span className="font-semibold text-white/80">{user.name}</span> : null}
          {user?.email ? <span className="block truncate">{user.email}</span> : null}
        </div>

        <nav className="mt-6 space-y-2">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" onClick={() => setOpen(false)} />
          <NavItem to="/transactions" icon="receipt_long" label="Transactions" onClick={() => setOpen(false)} />
          <NavItem to="/settings" icon="settings" label="Settings" onClick={() => setOpen(false)} />
          {user?.role === "admin" ? (
  <NavItem to="/admin" icon="admin_panel_settings" label="Admin" onClick={() => setOpen(false)} />
) : null}

        </nav>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            onClick={() => setTheme(nextTheme)}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            type="button"
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              logout
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open ? (
        <button
          aria-label="Close navigation overlay"
          type="button"
          className="fixed inset-0 z-40 bg-[color:var(--overlay)] md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Main */}
      <main id="main" tabIndex={-1} className="w-full px-4 py-6 md:ml-72 md:w-[calc(100%-18rem)] md:px-8">
        {children}
      </main>
    </div>
  );
}
