import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useTransactions } from "../context/TransactionsContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/format";

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold text-white/50">{label}</div>
      <div className="mt-1 text-sm font-bold text-white/90">{value}</div>
    </div>
  );
}

export default function Details() {
  const { id } = useParams();
  const nav = useNavigate();
  const { getById, remove } = useTransactions();
  const { currency } = useSettings();

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    (async () => {
      try {
        const t = await getById(id);
        if (!alive) return;
        setTx(t);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load transaction.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, getById]);

  async function onDelete() {
    setDeleting(true);
    try {
      await remove(id);
      nav("/transactions");
    } catch (e) {
      setErr(e?.message || "Delete failed.");
    } finally {
      setDeleting(false);
      setConfirm(false);
    }
  }

  const isIncome = tx?.type === "income";

  return (
    <Layout title="Transaction details">
      <PageHeader
        title="Transaction details"
        subtitle="View, edit, or delete this transaction."
        right={
          <Button variant="secondary" onClick={() => nav("/transactions")}>
            Back
          </Button>
        }
      />

      {loading ? (
        <div className="mt-6">
          <Spinner />
        </div>
      ) : null}

      {err ? (
        <div className="mt-6">
          <Alert title="Something went wrong">{err}</Alert>
        </div>
      ) : null}

      {tx && !loading ? (
        <div className="mt-6 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs text-white/60">Amount</div>
                <div className={`mt-1 text-3xl font-extrabold ${isIncome ? "text-emerald-200" : "text-red-200"}`}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(Number(tx.amount || 0), currency)}
                </div>
                <div className="mt-2 text-sm text-white/70">{tx.description || "—"}</div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => nav(`/transactions/${id}/edit`)}>Edit</Button>
                <Button variant="danger" onClick={() => setConfirm(true)} disabled={deleting}>
                  Delete
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Type" value={tx.type} />
              <Info label="Category" value={tx.category || "Other"} />
              <Info label="Date" value={tx.date} />
              <Info label="ID" value={String(tx.id)} />
            </div>
          </Card>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirm}
        title="Delete transaction?"
        message="This action cannot be undone."
        confirmText={deleting ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        danger
        onCancel={() => setConfirm(false)}
        onConfirm={onDelete}
      />
    </Layout>
  );
}
