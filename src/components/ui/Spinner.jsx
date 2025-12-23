import React from "react";

export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-3 text-white/80" role="status" aria-live="polite" aria-atomic="true">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
