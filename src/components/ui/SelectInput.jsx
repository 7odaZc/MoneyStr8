import React, { useId } from "react";

export default function SelectInput({
  label,
  hint,
  error,
  className = "",
  id,
  children,
  ...props
}) {
  const reactId = useId();
  const inputId = id || `${props.name || "sel"}-${reactId}`;
  const showHint = Boolean(hint && !error);
  const showError = Boolean(error);
  const hintId = showHint ? `${inputId}-hint` : undefined;
  const errorId = showError ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const hasError = showError;
  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-semibold text-white/90 mb-1">
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-errormessage={hasError ? errorId : undefined}
        className={`w-full rounded-lg bg-white/10 border px-3 py-2.5 text-sm text-white
          focus:outline-none focus:ring-2 focus:ring-emerald-400/60
          ${error ? "border-red-400/70" : "border-white/10"}`}
        {...props}
      >
        {children}
      </select>
      {showHint ? (
        <p id={hintId} className="mt-1 text-xs text-white/50">
          {hint}
        </p>
      ) : null}
      {showError ? (
        <p id={errorId} className="mt-1 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
