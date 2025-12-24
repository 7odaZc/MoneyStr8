import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { AUTH_STORAGE_KEYS } from "../context/AuthContext";

function readUsers() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USERS);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(readUsers());
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => String(u.role).toLowerCase() === "admin").length;
    const normal = total - admins;
    return { total, admins, normal };
  }, [users]);

  return (
    <Layout title="Admin">
      <PageHeader
        title="Admin Panel"
        subtitle="Role-based UI demo (localStorage auth)."
        right={
          <Button variant="secondary" size="sm" onClick={() => setUsers(readUsers())}>
            Refresh
          </Button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-white/60">Users</div>
          <div className="mt-2 text-3xl font-extrabold">{stats.total}</div>
          <div className="mt-2 text-sm text-white/70">
            Admins: <span className="font-semibold text-white">{stats.admins}</span> • Users:{" "}
            <span className="font-semibold text-white">{stats.normal}</span>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="text-lg font-extrabold">Registered Accounts</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/70">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-2 pr-3 text-white/90">{u.name || "—"}</td>
                    <td className="py-2 pr-3 text-white/90">{u.email}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          String(u.role).toLowerCase() === "admin" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/80"
                        }`}
                      >
                        {String(u.role || "user")}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-white/60">
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-white/50">
            Demo admin: <span className="text-white/80">admin@moneystr8.com / admin123</span>
            <br />
            Demo user: <span className="text-white/80">user@moneystr8.com / user123</span>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
