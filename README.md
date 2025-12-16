# Personal Finance Tracker (Phase 3 + Phase 4)

A simple **personal finance tracker** built with **Vite + React + React Router + Tailwind** and a **mock REST API (JSON Server)**.

## Features

- **Authentication (simulated)**: Register/Login using `localStorage` (no real backend).
- **Transactions CRUD** (mock API):
  - Create / Read / Update / Delete transactions
  - Global state via React Context (`TransactionsContext`)
- **Dashboard analytics**
  - Totals (income, expenses, balance)
  - Charts (monthly income vs expenses + spending by category)
- **Transactions page**
  - Search + filters (type, category, date range)
  - Sorting
  - Responsive table (desktop) + card list (mobile)
- **Settings**
  - Currency preference (stored in `localStorage`)
  - Delete-all transactions (danger action)

## Requirements mapping (quick)

- **Phase 3**: Multi-page app, routing, reusable components, responsive layout.
- **Phase 4**: Mock API + CRUD, global state management, loading/error handling, form validation.

## Run locally

### 1) Install
```bash
npm install
```

### 2) Start the mock API
```bash
npm run api
```
This starts JSON Server on `http://localhost:3001` using `backend/db.json`.

### 3) Start the React app
```bash
npm run dev
```

### Optional: start both together
```bash
npm run dev:all
```

## Notes

- If the API isn’t running, the protected pages will show an error with a **Retry** button.
- Transactions are stored in `backend/db.json` via JSON Server during development.
