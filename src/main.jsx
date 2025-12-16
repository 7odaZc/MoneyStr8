import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { TransactionsProvider } from "./context/TransactionsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>
);
