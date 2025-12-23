import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthed } = useAuth();

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-[color:var(--bg)]"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex items-center justify-between">
          <div className="text-xl font-extrabold">MoneyStr8</div>
          <div className="flex items-center gap-2">
            {isAuthed ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <main id="main" tabIndex={-1}>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Track income & expenses.
                <span className="block text-emerald-300">Get your Money Straight.</span>
              </h1>
              <p className="mt-4 text-base text-white/70">
                Add transactions, filter and search them, and get quick insights with charts.
                Everything is responsive and works great on mobile.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                {isAuthed ? (
                  <Link to="/transactions">
                    <Button size="lg">View Transactions</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="secondary">
                        I already have an account
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FadeIn index={0}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-bold">CRUD</div>
                    <div className="mt-1 text-xs text-white/60">Add, edit, delete transactions.</div>
                  </div>
                </FadeIn>
                <FadeIn index={1}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-bold">Filters</div>
                    <div className="mt-1 text-xs text-white/60">Type, category, date range, search.</div>
                  </div>
                </FadeIn>
                <FadeIn index={2}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-bold">Charts</div>
                    <div className="mt-1 text-xs text-white/60">Monthly trends + category split.</div>
                  </div>
                </FadeIn>
              </div>
            </div>

            <FadeIn index={3}>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-white/5 p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-300" aria-hidden="true">
                    receipt_long
                  </span>
                  <div>
                    <div className="text-lg font-extrabold">Tip</div>
                    <p className="mt-1 text-sm text-white/70">
                      Start by adding your salary as an <span className="font-semibold text-white">Income</span> transaction,
                      then add your daily expenses. The dashboard updates instantly.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/10 p-4">
                  <div className="text-xs text-white/60">Example transaction</div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold">Groceries</div>
                      <div className="text-xs text-white/60">2025-12-01 • expense</div>
                    </div>
                    <div className="text-lg font-extrabold text-red-300">-72.50</div>
                  </div>
                  <div className="mt-2 text-sm text-white/70">Weekly grocery shopping</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </main>

        <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
          Built with React + Tailwind + JSON Server (mock API).
        </footer>
      </div>
    </div>
  );
}
