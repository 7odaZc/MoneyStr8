import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const NavItem = ({ icon, label, to }) => {
    const active = window.location.pathname === to;
    return (
      <button
        onClick={() => {
          navigate(to);
          setOpen(false);
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition
        ${active ? "bg-[#49B784]/40 font-bold" : "hover:bg-white/10"}
        text-white`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#082D23]">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[200] bg-white/10 border border-white/20 text-white p-2 rounded-lg"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[150]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-[#0c3327] text-white shadow-xl z-[200]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-6">
          <img src="/Logo.png" className="h-10 mx-auto md:mx-0" />
        </div>

        <nav className="px-4 space-y-2">
          <NavItem icon="dashboard" label="Dashboard" to="/dashboard" />
          <NavItem icon="receipt_long" label="Transactions" to="/transactions" />
          <NavItem icon="settings" label="Settings" to="/settings" />
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 md:ml-64 text-[#BDEED0]">
        {children}
      </main>
    </div>
  );
}
