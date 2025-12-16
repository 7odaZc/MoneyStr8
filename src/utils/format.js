export function formatCurrency(amount, currency = "USD") {
  const n = Number(amount || 0);
  // Keep it robust; Intl can throw for weird currency codes
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function parseISODate(dateStr) {
  // expects YYYY-MM-DD; returns Date or null
  if (!dateStr || typeof dateStr !== "string") return null;
  const d = new Date(dateStr + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function ymKey(dateStr) {
  const d = parseISODate(dateStr);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function labelMonth(ym) {
  // ym like YYYY-MM
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString(undefined, { month: "short" }) + " " + y;
}
