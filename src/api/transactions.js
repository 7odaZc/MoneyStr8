import { http } from "./http";

export function listTransactions() {
  return http("/transactions?_sort=date&_order=desc");
}

export function getTransaction(id) {
  return http(`/transactions/${id}`);
}

export function createTransaction(tx) {
  return http("/transactions", { method: "POST", body: JSON.stringify(tx) });
}

export function updateTransaction(id, tx) {
  return http(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(tx) });
}

export function deleteTransaction(id) {
  return http(`/transactions/${id}`, { method: "DELETE" });
}
