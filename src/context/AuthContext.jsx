import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AUTH_STORAGE_KEYS = {
  USERS: "pf_users_v1",
  SESSION: "pf_session_v1",
};

function uid() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  return r === "admin" ? "admin" : "user";
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USERS);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function ensureSeedUsers() {
  const users = loadUsers();
  if (users.length) return;

  const seeded = [
    { id: uid(), name: "Admin", email: "admin@moneystr8.com", password: "admin123", role: "admin" },
    { id: uid(), name: "Demo User", email: "user@moneystr8.com", password: "user123", role: "user" },
  ];
  saveUsers(seeded);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    ensureSeedUsers();

    const session = loadSession();
    if (session?.email) {
      setUser({
        email: session.email,
        name: session.name || "",
        role: normalizeRole(session.role),
        token: session.token || "",
      });
    }
  }, []);

  const api = useMemo(() => {
    function logout() {
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      setUser(null);
    }

    function register({ name, email, password }) {
      if (!email || !password) throw new Error("Email and password are required.");

      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) throw new Error("This email is already registered.");

      // if someone clears localStorage, the first registered user becomes admin (easy role testing)
      const nextRole = users.length === 0 ? "admin" : "user";

      const newUser = { id: uid(), name: name || "", email, password, role: nextRole };
      saveUsers([...users, newUser]);

      const session = { email: newUser.email, name: newUser.name || "", role: newUser.role, token: uid() };
      saveSession(session);
      setUser({ email: session.email, name: session.name, role: session.role, token: session.token });
    }

    function login({ email, password }) {
      if (!email || !password) throw new Error("Email and password are required.");

      const users = loadUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found || found.password !== password) throw new Error("Invalid email or password.");

      const session = {
        email: found.email,
        name: found.name || "",
        role: normalizeRole(found.role),
        token: uid(),
      };
      saveSession(session);
      setUser({ email: session.email, name: session.name, role: session.role, token: session.token });
    }

    function hasRole(roles) {
      if (!roles) return true;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.map(normalizeRole).includes(normalizeRole(user?.role));
    }

    return {
      user,
      login,
      register,
      logout,
      isAuthed: !!user,
      isAdmin: normalizeRole(user?.role) === "admin",
      hasRole,
    };
  }, [user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
