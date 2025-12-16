import React, { useMemo } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { useTransactions } from "../context/TransactionsContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency, labelMonth, ymKey } from "../utils/format";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F472B6", "#A78BFA", "#F87171", "#22C55E", "#EAB308"];

function sumBy(items, pred) {
  return items.reduce((acc, it) => (pred(it) ? acc + Number(it.amount || 0) : acc), 0);
}

export default function Dashboard() {
  const { items, loading, error, refresh } = useTransactions();
  const { currency } = useSettings();

  const now = new Date();
  const thisYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const stats = useMemo(() => {
    const income = sumBy(items, (t) => t.type === "income");
    const expense = sumBy(items, (t) => t.type === "expense");
    return { income, expense, balance: income - expense };
  }, [items]);

  const monthStats = useMemo(() => {
    const inMonth = items.filter((t) => ymKey(t.date) === thisYM);
    const income = sumBy(inMonth, (t) => t.type === "income");
    const expense = sumBy(inMonth, (t) => t.type === "expense");
    return { income, expense, balance: income - expense };
  }, [items, thisYM]);

  const pieData = useMemo(() => {
    const inMonth = items.filter((t) => ymKey(t.date) === thisYM && t.type === "expense");
    const map = new Map();
    for (const t of inMonth) {
      const k = t.category || "Other";
      map.set(k, (map.get(k) || 0) + Number(t.amount || 0));
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [items, thisYM]);

  const monthlyData = useMemo(() => {
    // last 6 months including current
    const months = [];
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 5; i >= 0; i--) {
      const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const ym = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
      months.push(ym);
    }

    const byMonth = new Map(months.map((m) => [m, { income: 0, expense: 0 }]));
    for (const t of items) {
      const k = ymKey(t.date);
      if (!k || !byMonth.has(k)) continue;
      const ref = byMonth.get(k);
      if (t.type === "income") ref.income += Number(t.amount || 0);
      if (t.type === "expense") ref.expense += Number(t.amount || 0);
    }

    return months.map((m) => ({
      month: labelMonth(m),
      income: Number(byMonth.get(m)?.income || 0),
      expense: Number(byMonth.get(m)?.expense || 0),
    }));
  }, [items, now]);

  return (
    <Layout title="Dashboard">
      <PageHeader
        title="Dashboard"
        subtitle="Totals and quick insights from your transactions."
      />

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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Current balance" value={formatCurrency(stats.balance, currency)} />
        <StatCard label="Total income" value={formatCurrency(stats.income, currency)} />
        <StatCard label="Total expenses" value={formatCurrency(stats.expense, currency)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="This month balance" value={formatCurrency(monthStats.balance, currency)} hint={labelMonth(thisYM)} />
        <StatCard label="This month income" value={formatCurrency(monthStats.income, currency)} hint={labelMonth(thisYM)} />
        <StatCard label="This month expenses" value={formatCurrency(monthStats.expense, currency)} hint={labelMonth(thisYM)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-extrabold">Spending by category</div>
              <div className="text-xs text-white/60">{labelMonth(thisYM)} • expenses only</div>
            </div>
          </div>

          <div className="mt-4 h-72">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-white/60">
                No expenses this month yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(v, currency)}
                    contentStyle={{ background: "#071B15", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div>
            <div className="text-lg font-extrabold">Monthly income vs expenses</div>
            <div className="text-xs text-white/60">Last 6 months</div>
          </div>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                <Tooltip
                  formatter={(v, name) => [formatCurrency(v, currency), name]}
                  contentStyle={{ background: "#071B15", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <Legend />
                <Bar dataKey="income" fill="#34D399" />
                <Bar dataKey="expense" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
