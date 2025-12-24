import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

let mockAuth = { isAuthed: false, hasRole: () => true, user: null };

// ✅ correct path from src/components/ui -> src/context
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

test("redirects unauthenticated users to /login", () => {
  mockAuth = { isAuthed: false, hasRole: () => true, user: null };

  render(
    <MemoryRouter initialEntries={["/secret"]}>
      <Routes>
        <Route path="/login" element={<div>LOGIN</div>} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <div>SECRET</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("LOGIN")).toBeInTheDocument();
});

test("blocks users who lack the required role", () => {
  mockAuth = { isAuthed: true, hasRole: () => false, user: { role: "user" } };

  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/dashboard" element={<div>DASHBOARD</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <div>ADMIN</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
});
