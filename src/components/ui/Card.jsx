import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 ${className}`}>
      {children}
    </div>
  );
}
