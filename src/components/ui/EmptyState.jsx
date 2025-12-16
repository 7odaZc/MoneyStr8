import React from "react";
import Button from "./Button";

export default function EmptyState({ title = "Nothing here yet", subtitle, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
      <div className="text-lg font-extrabold text-white">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
      {actionLabel && onAction ? (
        <div className="mt-4 flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
