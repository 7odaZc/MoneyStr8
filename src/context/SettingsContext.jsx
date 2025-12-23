import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);
const LS_SETTINGS = "pf_settings_v1";

const DEFAULTS = {
  currency: "USD",
  theme: "dark",
};

const THEMES = ["dark", "light"];

function normalizeTheme(value) {
  return THEMES.includes(value) ? value : DEFAULTS.theme;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    const obj = raw ? JSON.parse(raw) : {};
    const merged = { ...DEFAULTS, ...(obj && typeof obj === "object" ? obj : {}) };
    return { ...merged, theme: normalizeTheme(merged.theme) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    document.documentElement.dataset.theme = normalizeTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const api = useMemo(() => {
    return {
      currency: settings.currency,
      theme: settings.theme,
      setCurrency: (currency) => setSettings((s) => ({ ...s, currency })),
      setTheme: (theme) => setSettings((s) => ({ ...s, theme: normalizeTheme(theme) })),
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

export const THEME_OPTIONS = [
  { code: "dark", label: "Dark" },
  { code: "light", label: "Light" },
];
