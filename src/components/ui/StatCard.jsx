import React from "react";
import Card from "./Card";

export default function StatCard({ label, value, hint }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/40">{hint}</div> : null}
    </Card>
  );
}
