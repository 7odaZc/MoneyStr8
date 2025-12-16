import React from "react";
import Layout from "../components/Layout";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const pieData = [
    { name: "Needs", value: 55 },
    { name: "Wants", value: 25 },
    { name: "Savings", value: 20 },
  ];

  const barData = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 210 },
    { name: "Wed", value: 160 },
    { name: "Thu", value: 80 },
    { name: "Fri", value: 90 },
    { name: "Sat", value: 240 },
    { name: "Sun", value: 130 },
  ];

  const COLORS = ["#49B784", "#2E8B6D", "#BDEED0"];

  const axisColor = "#BDEED0";
  const tooltipBg = "#0F3A2E";
  const tooltipText = "#BDEED0";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <span className="text-white/60 text-sm">Static prototype</span>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
            <p className="text-white/60 text-sm">Balance</p>
            <p className="text-2xl font-bold mt-2">$12,480.00</p>
          </div>
          <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
            <p className="text-white/60 text-sm">Income (month)</p>
            <p className="text-2xl font-bold mt-2 text-[#49B784]">+$3,500.00</p>
          </div>
          <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
            <p className="text-white/60 text-sm">Expenses (month)</p>
            <p className="text-2xl font-bold mt-2 text-red-300">-$1,240.00</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
            <h2 className="font-bold text-lg mb-4">Budget split</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: "none", color: tooltipText }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
            <h2 className="font-bold text-lg mb-4">Spending this week</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke={axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: "none", color: tooltipText }} />
                  <Bar dataKey="value" fill="#49B784" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent */}
        <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-6">
          <h2 className="font-bold text-lg mb-4">Recent transactions</h2>
          <div className="space-y-3">
            {[
              { label: "Groceries", amount: "-$72.50", meta: "Oct 26 · Expense" },
              { label: "Salary", amount: "+$3,500.00", meta: "Oct 24 · Income" },
              { label: "Uber", amount: "-$18.00", meta: "Oct 23 · Expense" },
            ].map((r, idx) => (
              <div key={idx} className="flex items-center justify-between border border-white/10 rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">{r.label}</p>
                  <p className="text-white/60 text-sm">{r.meta}</p>
                </div>
                <p className={r.amount.startsWith("+") ? "text-[#49B784] font-bold" : "text-red-300 font-bold"}>
                  {r.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
