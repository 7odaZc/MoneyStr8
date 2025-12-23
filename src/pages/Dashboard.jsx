import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import FadeIn from "../components/ui/FadeIn";
import SelectInput from "../components/ui/SelectInput";
import { useTransactions } from "../context/TransactionsContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency, labelMonth, ymKey } from "../utils/format";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F472B6", "#A78BFA", "#F87171", "#22C55E", "#EAB308"];
const axisTick = { fill: "var(--chart-tick)", fontSize: 12 };
const tooltipStyles = {
  background: "var(--tooltip-bg)",
  border: "1px solid var(--tooltip-border)",
  color: "var(--tooltip-text)",
};
const tooltipText = { color: "var(--tooltip-muted)" };
const MARKET_METRICS = [
  { value: "market_cap", label: "Market cap" },
  { value: "current_price", label: "Price" },
  { value: "total_volume", label: "24h volume" },
];
const MARKET_COUNTS = [10, 20, 50];
const RANGE_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];
const MARKET_POLL_MS = 60000;
const SUPPORTED_MARKET_CURRENCIES = ["usd", "eur", "gbp", "egp"];

function sumBy(items, pred) {
  return items.reduce((acc, it) => (pred(it) ? acc + Number(it.amount || 0) : acc), 0);
}

function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function labelDay(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatCompactCurrency(amount, currencyCode) {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return formatCurrency(n, currencyCode);
  }
}

export default function Dashboard() {
  const { items, loading, error, refresh } = useTransactions();
  const { currency } = useSettings();
  const [marketMetric, setMarketMetric] = useState("market_cap");
  const [marketCount, setMarketCount] = useState(MARKET_COUNTS[0]);
  const [marketData, setMarketData] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");
  const [marketLastUpdated, setMarketLastUpdated] = useState(null);
  const [selectedCoinId, setSelectedCoinId] = useState("");
  const [rangeDays, setRangeDays] = useState(RANGE_OPTIONS[0].value);
  const [seriesData, setSeriesData] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesError, setSeriesError] = useState("");

  const marketCurrency = useMemo(() => {
    const code = String(currency || "USD").toLowerCase();
    return SUPPORTED_MARKET_CURRENCIES.includes(code) ? code : "usd";
  }, [currency]);
  const marketCurrencyLabel = marketCurrency.toUpperCase();

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

  const dailyExpenseData = useMemo(() => {
    const days = [];
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dayKey(d);
      days.push({ key, day: labelDay(d), expense: 0 });
    }

    const byDay = new Map(days.map((d) => [d.key, d]));
    for (const t of items) {
      if (t.type !== "expense") continue;
      const ref = byDay.get(t.date);
      if (!ref) continue;
      ref.expense += Number(t.amount || 0);
    }

    return days.map(({ day, expense }) => ({
      day,
      expense: Number(expense || 0),
    }));
  }, [items, now]);

  const netTrendData = useMemo(() => {
    return monthlyData.map((m) => ({
      month: m.month,
      net: Number(m.income || 0) - Number(m.expense || 0),
    }));
  }, [monthlyData]);

  useEffect(() => {
    let alive = true;
    let controller = null;

    async function loadMarket() {
      if (controller) controller.abort();
      controller = new AbortController();
      setMarketLoading(true);
      setMarketError("");

      try {
        const params = new URLSearchParams({
          vs_currency: marketCurrency,
          order: "market_cap_desc",
          per_page: String(marketCount),
          page: "1",
          sparkline: "false",
        });
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch market data.");
        const data = await res.json();

        if (!alive) return;
        const mapped = Array.isArray(data)
          ? data.map((coin) => ({
              id: coin.id,
              name: coin.name,
              symbol: String(coin.symbol || "").toUpperCase() || coin.name,
              current_price: Number(coin.current_price || 0),
              market_cap: Number(coin.market_cap || 0),
              total_volume: Number(coin.total_volume || 0),
              price_change_percentage_24h: Number(coin.price_change_percentage_24h || 0),
            }))
          : [];
        setMarketData(mapped);
        setMarketLastUpdated(new Date());
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (!alive) return;
        setMarketError(err?.message || "Failed to fetch market data.");
      } finally {
        if (alive) setMarketLoading(false);
      }
    }

    loadMarket();
    const intervalId = setInterval(loadMarket, MARKET_POLL_MS);
    return () => {
      alive = false;
      if (controller) controller.abort();
      clearInterval(intervalId);
    };
  }, [marketCurrency, marketCount]);

  useEffect(() => {
    if (marketData.length === 0) {
      setSelectedCoinId("");
      return;
    }
    setSelectedCoinId((prev) => {
      if (prev && marketData.some((coin) => coin.id === prev)) return prev;
      return marketData[0].id;
    });
  }, [marketData]);

  const selectedCoin = useMemo(
    () => marketData.find((coin) => coin.id === selectedCoinId) || null,
    [marketData, selectedCoinId]
  );

  useEffect(() => {
    if (!selectedCoinId) {
      setSeriesData([]);
      return;
    }

    let alive = true;
    let controller = null;

    async function loadSeries() {
      if (controller) controller.abort();
      controller = new AbortController();
      setSeriesLoading(true);
      setSeriesError("");

      try {
        const params = new URLSearchParams({
          vs_currency: marketCurrency,
          days: String(rangeDays),
        });
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoinId}/market_chart?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch price history.");
        const data = await res.json();
        if (!alive) return;
        const prices = Array.isArray(data?.prices) ? data.prices : [];
        const mapped = prices.map(([ts, price]) => ({
          time: new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          price: Number(price || 0),
        }));
        setSeriesData(mapped);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (!alive) return;
        setSeriesError(err?.message || "Failed to fetch price history.");
      } finally {
        if (alive) setSeriesLoading(false);
      }
    }

    loadSeries();
    const intervalId = setInterval(loadSeries, MARKET_POLL_MS);
    return () => {
      alive = false;
      if (controller) controller.abort();
      clearInterval(intervalId);
    };
  }, [selectedCoinId, marketCurrency, rangeDays]);

  const statCards = [
    { label: "Current balance", value: formatCurrency(stats.balance, currency) },
    { label: "Total income", value: formatCurrency(stats.income, currency) },
    { label: "Total expenses", value: formatCurrency(stats.expense, currency) },
  ];

  const monthCards = [
    { label: "This month balance", value: formatCurrency(monthStats.balance, currency), hint: labelMonth(thisYM) },
    { label: "This month income", value: formatCurrency(monthStats.income, currency), hint: labelMonth(thisYM) },
    { label: "This month expenses", value: formatCurrency(monthStats.expense, currency), hint: labelMonth(thisYM) },
  ];

  const chartStart = statCards.length + monthCards.length;
  const marketChartStart = chartStart + 4;
  const marketMetricLabel = MARKET_METRICS.find((m) => m.value === marketMetric)?.label || "Value";
  const marketUpdatedLabel = marketLastUpdated
    ? marketLastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const showMarketSpinner = marketLoading && marketData.length === 0;
  const showSeriesSpinner = seriesLoading && seriesData.length === 0;
  const change24h = selectedCoin?.price_change_percentage_24h;
  const change24hLabel = Number.isFinite(change24h) ? `${change24h.toFixed(2)}%` : "N/A";

  function handleMarketSelect(entry) {
    const id = entry?.payload?.id;
    if (id) setSelectedCoinId(id);
  }

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
        {statCards.map((card, index) => (
          <FadeIn key={card.label} index={index}>
            <StatCard label={card.label} value={card.value} />
          </FadeIn>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {monthCards.map((card, index) => (
          <FadeIn key={card.label} index={statCards.length + index}>
            <StatCard label={card.label} value={card.value} hint={card.hint} />
          </FadeIn>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FadeIn index={chartStart}>
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
                      contentStyle={tooltipStyles}
                      labelStyle={tooltipText}
                      itemStyle={tooltipText}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </FadeIn>

        <FadeIn index={chartStart + 1}>
          <Card className="p-5">
            <div>
              <div className="text-lg font-extrabold">Monthly income vs expenses</div>
              <div className="text-xs text-white/60">Last 6 months</div>
            </div>

            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={axisTick} />
                  <Tooltip
                    formatter={(v, name) => [formatCurrency(v, currency), name]}
                    contentStyle={tooltipStyles}
                    labelStyle={tooltipText}
                    itemStyle={tooltipText}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#34D399" />
                  <Bar dataKey="expense" fill="#F87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FadeIn index={chartStart + 2}>
          <Card className="p-5">
            <div>
              <div className="text-lg font-extrabold">Net cash flow</div>
              <div className="text-xs text-white/60">Last 6 months</div>
            </div>

            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={netTrendData}>
                  <XAxis dataKey="month" tick={axisTick} />
                  <Tooltip
                    formatter={(v) => formatCurrency(v, currency)}
                    contentStyle={tooltipStyles}
                    labelStyle={tooltipText}
                    itemStyle={tooltipText}
                  />
                  <Line type="monotone" dataKey="net" name="Net" stroke="#60A5FA" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </FadeIn>

        <FadeIn index={chartStart + 3}>
          <Card className="p-5">
            <div>
              <div className="text-lg font-extrabold">Daily expenses</div>
              <div className="text-xs text-white/60">Last 14 days</div>
            </div>

            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyExpenseData}>
                  <XAxis dataKey="day" tick={axisTick} />
                  <Tooltip
                    formatter={(v) => formatCurrency(v, currency)}
                    contentStyle={tooltipStyles}
                    labelStyle={tooltipText}
                    itemStyle={tooltipText}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expenses"
                    stroke="#F87171"
                    strokeWidth={2}
                    fill="rgba(248,113,113,0.25)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FadeIn index={marketChartStart}>
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-lg font-extrabold">Live market snapshot</div>
                <div className="text-xs text-white/60">
                  Top crypto assets - Values in {marketCurrencyLabel} - Auto-refreshes every 60s (CoinGecko)
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <SelectInput
                  label="Metric"
                  value={marketMetric}
                  onChange={(e) => setMarketMetric(e.target.value)}
                  className="min-w-[160px]"
                >
                  {MARKET_METRICS.map((metric) => (
                    <option key={metric.value} value={metric.value}>
                      {metric.label}
                    </option>
                  ))}
                </SelectInput>
                <SelectInput
                  label="Assets"
                  value={String(marketCount)}
                  onChange={(e) => setMarketCount(Number(e.target.value))}
                  className="min-w-[120px]"
                >
                  {MARKET_COUNTS.map((count) => (
                    <option key={count} value={count}>
                      Top {count}
                    </option>
                  ))}
                </SelectInput>
              </div>
            </div>

            <div className="mt-4 h-72">
              {showMarketSpinner ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner label="Loading market data..." />
                </div>
              ) : null}

              {!showMarketSpinner && marketError && marketData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-red-200">
                  {marketError}
                </div>
              ) : null}

              {!showMarketSpinner && !marketError && marketData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  No market data available.
                </div>
              ) : null}

              {marketData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="symbol" tick={axisTick} />
                    <YAxis
                      tick={axisTick}
                      width={70}
                      tickFormatter={(v) => formatCompactCurrency(v, marketCurrencyLabel)}
                    />
                    <Tooltip
                      formatter={(v) => formatCompactCurrency(v, marketCurrencyLabel)}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
                      contentStyle={tooltipStyles}
                      labelStyle={tooltipText}
                      itemStyle={tooltipText}
                    />
                    <Bar dataKey={marketMetric} name={marketMetricLabel} cursor="pointer" onClick={handleMarketSelect}>
                      {marketData.map((coin) => (
                        <Cell
                          key={coin.id}
                          fill={coin.id === selectedCoinId ? "#34D399" : "rgba(255, 255, 255, 0.25)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
              <span>Click a bar to drill down.</span>
              <span>Last updated: {marketUpdatedLabel}</span>
            </div>
            {marketError && marketData.length > 0 ? (
              <div className="mt-1 text-xs text-red-200">Update failed: {marketError}</div>
            ) : null}
          </Card>
        </FadeIn>

        <FadeIn index={marketChartStart + 1}>
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-lg font-extrabold">Price trend</div>
                <div className="text-xs text-white/60">
                  {selectedCoin ? `${selectedCoin.name} (${selectedCoin.symbol})` : "Select a coin to drill down"}
                </div>
              </div>
              <SelectInput
                label="Range"
                value={String(rangeDays)}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="min-w-[140px]"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="mt-4 h-72">
              {showSeriesSpinner ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner label="Loading price history..." />
                </div>
              ) : null}

              {!showSeriesSpinner && seriesError && seriesData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-red-200">
                  {seriesError}
                </div>
              ) : null}

              {!showSeriesSpinner && !seriesError && seriesData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  Select a coin to see the trend.
                </div>
              ) : null}

              {seriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={seriesData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="time" tick={axisTick} />
                    <YAxis
                      tick={axisTick}
                      width={70}
                      tickFormatter={(v) => formatCompactCurrency(v, marketCurrencyLabel)}
                    />
                    <Tooltip
                      formatter={(v) => formatCurrency(v, marketCurrencyLabel)}
                      contentStyle={tooltipStyles}
                      labelStyle={tooltipText}
                      itemStyle={tooltipText}
                    />
                    <Line type="monotone" dataKey="price" name="Price" stroke="#34D399" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            {selectedCoin ? (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/70">
                <span>
                  <span className="font-semibold text-white">Price:</span>{" "}
                  {formatCurrency(selectedCoin.current_price, marketCurrencyLabel)}
                </span>
                <span>
                  <span className="font-semibold text-white">Market cap:</span>{" "}
                  {formatCompactCurrency(selectedCoin.market_cap, marketCurrencyLabel)}
                </span>
                <span className={`font-semibold ${change24h >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  24h: {change24hLabel}
                </span>
              </div>
            ) : null}
            {seriesError && seriesData.length > 0 ? (
              <div className="mt-1 text-xs text-red-200">Update failed: {seriesError}</div>
            ) : null}
          </Card>
        </FadeIn>
      </div>
    </Layout>
  );
}
