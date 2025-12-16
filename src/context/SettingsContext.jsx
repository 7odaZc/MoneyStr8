import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);
const LS_SETTINGS = "pf_settings_v1";

const DEFAULTS = {
  currency: "USD",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    const obj = raw ? JSON.parse(raw) : {};
    return { ...DEFAULTS, ...(obj && typeof obj === "object" ? obj : {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const api = useMemo(() => {
    return {
      currency: settings.currency,
      setCurrency: (currency) => setSettings((s) => ({ ...s, currency })),
    };
  }, [settings]);

  return <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "EGP", label: "EGP (E£)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
];
