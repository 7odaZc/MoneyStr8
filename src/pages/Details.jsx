import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data (same structure as your Transactions page)
  const transactions = [
    {
      id: 1,
      date: "Oct 26, 2023",
      type: "Expense",
      category: "Groceries",
      account: "Checking (...4321)",
      description:
        "Weekly shopping at the local market for groceries and household supplies.",
      amount: -125.5,
    },
    {
      id: 2,
      date: "Oct 25, 2023",
      type: "Income",
      category: "Salary",
      account: "Bank (...9988)",
      description: "Bi-weekly salary deposit.",
      amount: 2500,
    },
  ];

  const tx = transactions.find((t) => String(t.id) === id);

  if (!tx) {
    return (
      <Layout>
        <div className="text-center text-white text-xl mt-20">
          Transaction not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2 text-[#49B784] mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to list
        </button>

        {/* CARD */}
        <div className="bg-[#0F3A2E] border border-white/10 rounded-xl p-8 shadow-md">
          
          {/* AMOUNT */}
          <h1 className="text-4xl font-extrabold mb-6">
            {tx.amount < 0 ? (
              <span className="text-red-400">-${Math.abs(tx.amount)}</span>
            ) : (
              <span className="text-green-400">+${tx.amount}</span>
            )}
          </h1>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-8 text-white/90">

            <Info label="Type" value={tx.type} />
            <Info label="Category" value={tx.category} />

            <Info label="Date" value={tx.date} />
            <Info label="Account" value={tx.account} />

          </div>

          {/* DESCRIPTION */}
          <div className="text-white/90 mb-8">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-white/70">{tx.description}</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button className="bg-[#49B784] px-6 py-2 rounded-lg font-semibold">
              Edit
            </button>
            <button className="bg-red-600/30 border border-red-600 px-6 py-2 rounded-lg font-semibold text-red-300 hover:bg-red-600/50 transition">
              Delete
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}

/* --- Helper Component --- */
function Info({ label, value }) {
  return (
    <div>
      <h3 className="text-white/60 text-sm">{label}</h3>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
