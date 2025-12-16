import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Transactions() {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, date: "Oct 26, 2023", type: "Expense", category: "Groceries", description: "Weekly grocery shopping", amount: "-$72.5" },
    { id: 2, date: "Oct 24, 2023", type: "Income", category: "Salary", description: "Monthly salary", amount: "+$3,500.0" },
    { id: 3, date: "Oct 23, 2023", type: "Expense", category: "Transportation", description: "Uber ride", amount: "-$18.0" },
    { id: 4, date: "Oct 22, 2023", type: "Expense", category: "Dining", description: "Restaurant dinner", amount: "-$45.8" },
    { id: 5, date: "Oct 20, 2023", type: "Expense", category: "Utilities", description: "Electricity bill", amount: "-$112.3" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">Transactions</h1>
          <button
            className="bg-[#49B784] px-4 py-2 rounded-lg font-semibold text-[#082D23]"
            onClick={() => alert("Static prototype: Add Transaction form not wired.")}
          >
            + Add
          </button>
        </div>

        <div className="bg-[#0F3A2E] rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">{t.date}</td>
                    <td className="px-6 py-4">{t.type}</td>
                    <td className="px-6 py-4">{t.category}</td>
                    <td className="px-6 py-4">{t.description}</td>
                    <td className={`px-6 py-4 text-right ${t.amount.startsWith("+") ? "text-[#49B784]" : "text-red-300"}`}>{t.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-[#49B784] hover:underline"
                        onClick={() => navigate(`/transactions/${t.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
