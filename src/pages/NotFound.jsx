import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-4 py-10 text-white">
      <FadeIn index={0}>
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-2xl font-extrabold">Page not found</div>
          <p className="mt-2 text-sm text-white/70">
            That page doesn’t exist. Try going back to the dashboard.
          </p>
          <div className="mt-5 flex gap-2">
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
