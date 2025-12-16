import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { useTransactions, DEFAULT_CATEGORIES } from "../context/TransactionsContext";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export default function TransactionForm({ mode = "create" }) {
  const nav = useNavigate();
  const { id } = useParams();
  const { getById, create, update, items } = useTransactions();

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    type: "expense",
    category: "Other",
    amount: "",
    date: "",
    description: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    for (const t of items) if (t.category) set.add(t.category);
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
  }, [items]);

  useEffect(() => {
    let alive = true;
    if (!isEdit) return;

    setLoading(true);
    setError("");
    (async () => {
      try {
        const tx = await getById(id);
        if (!alive) return;
        setForm({
          type: tx.type || "expense",
          category: tx.category || "Other",
          amount: String(tx.amount ?? ""),
          date: tx.date || "",
          description: tx.description || "",
        });
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load transaction.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isEdit, id, getById]);

  function validate() {
    const errs = {};
    if (!form.type) errs.type = "Type is required.";
    if (!form.category || !form.category.trim()) errs.category = "Category is required.";
    const amount = toNum(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) errs.amount = "Amount must be a number greater than 0.";
    if (!form.date) errs.date = "Date is required.";
    return errs;
  }

  const errs = validate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (Object.keys(v).length) return;

    setSaving(true);
    try {
      const payload = {
        type: form.type,
        category: form.category.trim(),
        amount: Number(form.amount),
        date: form.date,
        description: form.description.trim(),
      };

      if (isEdit) {
        await update(id, payload);
        nav(`/transactions/${id}`);
      } else {
        const created = await create(payload);
        nav(`/transactions/${created.id}`);
      }
    } catch (e2) {
      setError(e2?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title={isEdit ? "Edit transaction" : "Add transaction"}>
      <PageHeader
        title={isEdit ? "Edit transaction" : "Add transaction"}
        subtitle="Fields: type, category, amount, date, description."
        right={
          <Button variant="secondary" onClick={() => nav(isEdit ? `/transactions/${id}` : "/transactions")}>
            Cancel
          </Button>
        }
      />

      {loading ? (
        <div className="mt-6">
          <Spinner />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6">
          <Alert title="Couldn’t save">{error}</Alert>
        </div>
      ) : null}

      {!loading ? (
        <form onSubmit={onSubmit} className="mt-6">
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectInput
                label="Type"
                value={form.type}
                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                error={errs.type || ""}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </SelectInput>

              <div>
                <TextInput
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                  error={errs.category || ""}
                  list="category-suggestions"
                  placeholder="e.g., Groceries"
                />
                <datalist id="category-suggestions">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <TextInput
                label="Amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
                error={errs.amount || ""}
                placeholder="e.g., 72.50"
              />

              <TextInput
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                error={errs.date || ""}
              />

              <div className="sm:col-span-2">
                <TextInput
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Optional details…"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="submit" disabled={saving || Object.keys(errs).length > 0}>
                {saving ? "Saving…" : isEdit ? "Save changes" : "Add transaction"}
              </Button>
            </div>
          </Card>
        </form>
      ) : null}
    </Layout>
  );
}
