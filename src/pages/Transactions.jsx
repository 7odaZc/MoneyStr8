import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import EmptyState from "../components/ui/EmptyState";
import Card from "../components/ui/Card";
import FadeIn from "../components/ui/FadeIn";
import { useTransactions, DEFAULT_CATEGORIES } from "../context/TransactionsContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency, parseISODate } from "../utils/format";

function typeLabel(t) {
  return t === "income" ? "Income" : "Expense";
}

export default function Transactions() {
  const nav = useNavigate();
  const { items, loading, error, refresh } = useTransactions();
  const { currency } = useSettings();

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sort, setSort] = useState("date_desc");

  const categories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    for (const t of items) if (t.category) set.add(t.category);
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const inRange = (tx) => {
      const d = parseISODate(tx.date);
      if (!d) return false;
      if (start) {
        const s = parseISODate(start);
        if (s && d < s) return false;
      }
      if (end) {
        const e = parseISODate(end);
        if (e && d > e) return false;
      }
      return true;
    };

    let list = items.slice();

    if (type !== "all") list = list.filter((t) => t.type === type);
    if (category !== "all") list = list.filter((t) => (t.category || "Other") === category);
    if (start || end) list = list.filter(inRange);

    if (query) {
      list = list.filter((t) => {
        const a = String(t.description || "").toLowerCase();
        const b = String(t.category || "").toLowerCase();
        const c = String(t.type || "").toLowerCase();
        return a.includes(query) || b.includes(query) || c.includes(query);
      });
    }

    const byDate = (a, b) => (parseISODate(a.date)?.getTime() || 0) - (parseISODate(b.date)?.getTime() || 0);

    list.sort((a, b) => {
      if (sort === "date_desc") return byDate(b, a);
      if (sort === "date_asc") return byDate(a, b);
      if (sort === "amount_desc") return Number(b.amount || 0) - Number(a.amount || 0);
      if (sort === "amount_asc") return Number(a.amount || 0) - Number(b.amount || 0);
      return 0;
    });

    return list;
  }, [items, q, type, category, start, end, sort]);
  const listStartIndex = 1;

  return (
    <Layout title="Transactions">
      <PageHeader
        title="Transactions"
        subtitle="Search, filter, and manage your income and expenses."
        right={
          <>
            <Button variant="secondary" onClick={refresh}>
              Refresh
            </Button>
            <Button onClick={() => nav("/transactions/new")}>+ Add</Button>
          </>
        }
      />

      <FadeIn index={0}>
        <Card className="mt-6 p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <TextInput
              label="Search"
              placeholder="Description, category, type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <SelectInput label="Type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </SelectInput>

            <SelectInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectInput>

            <TextInput label="From" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <TextInput label="To" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              <SelectInput label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date_desc">Newest</option>
                <option value="date_asc">Oldest</option>
                <option value="amount_desc">Amount (high)</option>
                <option value="amount_asc">Amount (low)</option>
              </SelectInput>
            </div>
          </div>
        </Card>
      </FadeIn>

      {loading ? (
        <div className="mt-6">
          <Spinner />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6">
          <Alert title="Couldn’t load transactions" onRetry={refresh}>
            {error}
          </Alert>
        </div>
      ) : null}

      <div className="mt-6">
        {filtered.length === 0 && !loading ? (
          <FadeIn index={listStartIndex}>
            <EmptyState
              title="No transactions found"
              subtitle="Try changing the filters, or add a new transaction."
              actionLabel="Add transaction"
              onAction={() => nav("/transactions/new")}
            />
          </FadeIn>
        ) : null}

        {/* Desktop table */}
        {filtered.length > 0 ? (
          <div className="hidden md:block">
            <FadeIn index={listStartIndex}>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Transactions list</caption>
                    <thead className="bg-white/5 text-white/70">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Description</th>
                        <th scope="col" className="px-5 py-3 font-semibold text-right">Amount</th>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => {
                        const isIncome = t.type === "income";
                        const txLabel = `${t.category || "Other"} on ${t.date}`;
                        return (
                          <tr key={t.id} className="border-t border-white/10 hover:bg-white/5">
                            <td className="px-5 py-4 text-white/80">{t.date}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                  isIncome ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"
                                }`}
                              >
                                {typeLabel(t.type)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-white/80">{t.category || "Other"}</td>
                            <td className="px-5 py-4 text-white/80">{t.description || "-"}</td>
                            <td className={`px-5 py-4 text-right font-extrabold ${isIncome ? "text-emerald-200" : "text-red-200"}`}>
                              {isIncome ? "+" : "-"}
                              {formatCurrency(Number(t.amount || 0), currency)}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Button
                                variant="ghost"
                                onClick={() => nav(`/transactions/${t.id}`)}
                                aria-label={`View transaction ${txLabel}`}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </FadeIn>
          </div>
        ) : null}

        {/* Mobile list */}
        {filtered.length > 0 ? (
          <div className="space-y-3 md:hidden">
            {filtered.map((t, idx) => {
              const isIncome = t.type === "income";
              return (
                <FadeIn key={t.id} index={listStartIndex + idx} className="w-full">
                  <button
                    onClick={() => nav(`/transactions/${t.id}`)}
                    type="button"
                    aria-label={`View transaction ${t.category || "Other"} on ${t.date}`}
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
                  >
                    <Card className="p-4 hover:bg-white/10 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-extrabold text-white">{t.category || "Other"}</div>
                          <div className="mt-0.5 text-xs text-white/60">
                            {t.date} • {typeLabel(t.type)}
                          </div>
                          {t.description ? (
                            <div className="mt-2 text-sm text-white/80">{t.description}</div>
                          ) : null}
                        </div>
                        <div className={`shrink-0 text-right font-extrabold ${isIncome ? "text-emerald-200" : "text-red-200"}`}>
                          {isIncome ? "+" : "-"}
                          {formatCurrency(Number(t.amount || 0), currency)}
                        </div>
                      </div>
                    </Card>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
