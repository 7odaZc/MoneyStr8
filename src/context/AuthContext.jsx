import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const LS_USERS = "pf_users_v1";
const LS_SESSION = "pf_session_v1";

function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = loadSession();
    if (session?.email) setUser({ email: session.email, name: session.name || "" });
  }, []);

  const api = useMemo(() => {
    function logout() {
      localStorage.removeItem(LS_SESSION);
      setUser(null);
    }

    function register({ name, email, password }) {
      if (!email || !password) throw new Error("Email and password are required.");
      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) throw new Error("This email is already registered.");

      const next = [...users, { id: crypto.randomUUID(), name: name || "", email, password }];
      saveUsers(next);

      // auto login
      localStorage.setItem(LS_SESSION, JSON.stringify({ email, name: name || "" }));
      setUser({ email, name: name || "" });
    }

    function login({ email, password }) {
      if (!email || !password) throw new Error("Email and password are required.");
      const users = loadUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found || found.password !== password) throw new Error("Invalid email or password.");

      localStorage.setItem(LS_SESSION, JSON.stringify({ email: found.email, name: found.name || "" }));
      setUser({ email: found.email, name: found.name || "" });
    }

    return { user, login, register, logout, isAuthed: !!user };
  }, [user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
