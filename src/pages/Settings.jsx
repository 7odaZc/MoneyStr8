import Layout from "../components/Layout";

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold mb-6">Settings & Profile</h1>

        {/* PROFILE CARD */}
        <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-5xl mb-4 text-white/60">
              account_circle
            </span>

            <h2 className="text-xl font-bold">Alex Doe</h2>
            <p className="text-white/60 text-sm mb-4">alex.doe@example.com</p>

            <button className="bg-[#49B784] w-full max-w-md py-2 rounded-lg font-semibold mt-2">
              Edit Profile
            </button>

            <button className="bg-white/10 w-full max-w-md py-2 rounded-lg font-semibold mt-2">
              Change Password
            </button>
          </div>
        </div>

        {/* GENERAL SETTINGS */}
        <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-8 mb-8">
          <h2 className="font-bold text-lg mb-4">General Settings</h2>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-white/80">
              <span className="material-symbols-outlined">dark_mode</span>
              Theme
            </div>
            <input type="checkbox" className="toggle-checkbox" />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-white/80">
              <span className="material-symbols-outlined">payments</span>
              Default Currency
            </div>

            <select className="bg-[#082D23] px-4 py-2 rounded-lg border border-white/20 text-white">
              <option>USD – US Dollar</option>
              <option>EGP – Egyptian Pound</option>
              <option>EUR – Euro</option>
            </select>
          </div>
        </div>

        {/* MONTHLY BUDGETS */}
        <div className="bg-[#0F3A2E] rounded-xl border border-white/10 p-8 mb-6">
          <h2 className="font-bold text-lg mb-4">Monthly Budgets</h2>

          <div className="space-y-4">
            <Budget label="Groceries" spent={300} total={500} />
            <Budget label="Transport" spent={120} total={200} />
            <Budget label="Entertainment" spent={250} total={250} />
            <Budget label="Utilities" spent={85} total={150} />
          </div>
        </div>

        <button className="bg-[#49B784] px-6 py-3 rounded-lg font-semibold">
          Save Changes
        </button>

      </div>
    </Layout>
  );
}

/* --- Helper Component --- */

function Budget({ label, spent, total }) {
  const percent = Math.min((spent / total) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-white/80 mb-1">
        <span>{label}</span>
        <span>
          ${spent} / ${total}
        </span>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%` }}
          className={`h-full rounded-full ${
            percent >= 100 ? "bg-red-500" : "bg-[#49B784]"
          }`}
        ></div>
      </div>
    </div>
  );
}
