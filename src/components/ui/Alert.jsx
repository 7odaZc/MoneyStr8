import React from "react";

export default function Alert({ title = "Error", children, onRetry }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-white"
    >
      <div className="font-bold">{title}</div>
      <div className="mt-1 text-sm text-white/80">{children}</div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-semibold text-red-200 hover:text-red-100 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
