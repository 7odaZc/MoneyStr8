import React from "react";
import ReactDOM from "react-dom/client";
import './output.css'    // <-- the file you copied from Mahomud/dist
import App from "./App";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
