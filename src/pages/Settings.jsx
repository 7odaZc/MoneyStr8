import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SelectInput from "../components/ui/SelectInput";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Alert from "../components/ui/Alert";
import FadeIn from "../components/ui/FadeIn";
import { CURRENCIES, THEME_OPTIONS, useSettings } from "../context/SettingsContext";
import { useTransactions } from "../context/TransactionsContext";
import { API_BASE } from "../api/http";

export default function Settings() {
  const { currency, setCurrency, theme, setTheme } = useSettings();
  const { items, remove, refresh } = useTransactions();

  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const txCount = useMemo(() => items.length, [items]);

  async function clearAll() {
    setBusy(true);
    setMsg("");
    try {
      // Delete one by one (simple + clear to explain in demo)
      for (const t of items) {
        // eslint-disable-next-line no-await-in-loop
        await remove(t.id);
      }
      await refresh();
      setMsg("All transactions were deleted.");
    } catch (e) {
      setMsg(e?.message || "Failed to clear transactions.");
    } finally {
      setBusy(false);
      setConfirmClear(false);
    }
  }

  return (
    <Layout title="Settings">
      <PageHeader title="Settings" subtitle="Small preferences for your tracker." />

      {msg ? (
        <div className="mt-6">
          <Alert title="Status">{msg}</Alert>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FadeIn index={0}>
          <Card className="p-5">
            <div className="text-lg font-extrabold">Preferences</div>
            <div className="mt-4 max-w-sm space-y-4">
              <div>
                <SelectInput label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </SelectInput>
                <p className="mt-2 text-xs text-white/60">
                  Used when formatting amounts in the UI.
                </p>
              </div>
              <div>
                <SelectInput label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  {THEME_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label}
                    </option>
                  ))}
                </SelectInput>
                <p className="mt-2 text-xs text-white/60">
                  Switch between light and dark mode.
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn index={1}>
          <Card className="p-5">
            <div className="text-lg font-extrabold">Data</div>
            <div className="mt-2 text-sm text-white/70">
              Transactions in the mock API: <span className="font-bold text-white">{txCount}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={refresh} disabled={busy}>
                Refresh
              </Button>
              <Button variant="danger" onClick={() => setConfirmClear(true)} disabled={busy || txCount === 0}>
                {busy ? "Working…" : "Delete all transactions"}
              </Button>
            </div>

            <div className="mt-4 text-xs text-white/60">
              API base: <span className="font-mono">{API_BASE}</span>
            </div>
          </Card>
        </FadeIn>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Delete all transactions?"
        message="This will remove every transaction from the mock API. You can’t undo this."
        danger
        confirmText={busy ? "Deleting…" : "Delete all"}
        onCancel={() => setConfirmClear(false)}
        onConfirm={clearAll}
      />
    </Layout>
  );
}
