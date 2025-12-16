import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  listTransactions,
  getTransaction as apiGet,
  createTransaction as apiCreate,
  updateTransaction as apiUpdate,
  deleteTransaction as apiDelete,
} from "../api/transactions";

const TransactionsContext = createContext(null);

const initial = {
  items: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, loading: false, items: action.items, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error || "Failed to load." };
    case "UPSERT": {
      const it = action.item;
      const idx = state.items.findIndex((x) => String(x.id) === String(it.id));
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = it;
        return { ...state, items: next };
      }
      return { ...state, items: [it, ...state.items] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((x) => String(x.id) !== String(action.id)) };
    default:
      return state;
  }
}

export function TransactionsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  async function refresh() {
    dispatch({ type: "LOAD_START" });
    try {
      const items = await listTransactions();
      dispatch({ type: "LOAD_SUCCESS", items: Array.isArray(items) ? items : [] });
    } catch (e) {
      dispatch({ type: "LOAD_ERROR", error: e?.message || String(e) });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const api = useMemo(() => {
    async function getById(id) {
      // prefer local first
      const local = state.items.find((x) => String(x.id) === String(id));
      if (local) return local;
      return await apiGet(id);
    }

    async function create(tx) {
      const payload = { ...tx };
      const created = await apiCreate(payload);
      dispatch({ type: "UPSERT", item: created });
      return created;
    }

    async function update(id, tx) {
      const payload = { ...tx, id };
      const updated = await apiUpdate(id, payload);
      dispatch({ type: "UPSERT", item: updated });
      return updated;
    }

    async function remove(id) {
      await apiDelete(id);
      dispatch({ type: "REMOVE", id });
    }

    return {
      items: state.items,
      loading: state.loading,
      error: state.error,
      refresh,
      getById,
      create,
      update,
      remove,
    };
  }, [state.items, state.loading, state.error]);

  return <TransactionsContext.Provider value={api}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}

// Common categories (you can still type your own in the form)
export const DEFAULT_CATEGORIES = [
  "Salary",
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Dining",
  "Shopping",
  "Healthcare",
  "Entertainment",
  "Education",
  "Savings",
  "Other",
];
