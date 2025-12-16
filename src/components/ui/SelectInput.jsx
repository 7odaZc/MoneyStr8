import React from "react";

export default function SelectInput({
  label,
  hint,
  error,
  className = "",
  id,
  children,
  ...props
}) {
  const inputId = id || props.name || `sel-${Math.random().toString(16).slice(2)}`;
  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-semibold text-white/90 mb-1">
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={`w-full rounded-lg bg-white/10 border px-3 py-2.5 text-sm text-white
          focus:outline-none focus:ring-2 focus:ring-emerald-400/60
          ${error ? "border-red-400/70" : "border-white/10"}`}
        {...props}
      >
        {children}
      </select>
      {hint && !error ? <p className="mt-1 text-xs text-white/50">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
