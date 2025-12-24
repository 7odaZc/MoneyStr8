import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

let mockAuth = { user: { email: "x@x.com", role: "user" }, logout: jest.fn() };

jest.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuth,
}));

jest.mock("../context/SettingsContext", () => ({
  useSettings: () => ({ theme: "dark", setTheme: jest.fn() }),
}));

test("hides Admin link for normal users", () => {
  mockAuth = { user: { email: "u@u.com", role: "user" }, logout: jest.fn() };

  render(
    <MemoryRouter>
      <Layout title="T">
        <div>Body</div>
      </Layout>
    </MemoryRouter>
  );

  expect(screen.queryByText("Admin")).toBeNull();
});

test("shows Admin link for admins", () => {
  mockAuth = { user: { email: "a@a.com", role: "admin" }, logout: jest.fn() };

  render(
    <MemoryRouter>
      <Layout title="T">
        <div>Body</div>
      </Layout>
    </MemoryRouter>
  );

  expect(screen.getByText("Admin")).toBeInTheDocument();
});
