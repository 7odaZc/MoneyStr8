import React from "react";

export default function Alert({ title = "Error", children, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-white"
    >
      <div className="font-bold">{title}</div>
      <div className="mt-1 text-sm text-white/80">{children}</div>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-3 text-sm font-semibold text-red-200 hover:text-red-100 underline"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
