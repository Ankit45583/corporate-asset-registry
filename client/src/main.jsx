import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// ✅ Correct imports - use relative path from src/
import "./styles/global.css";
import "./styles/login.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/assets.css";
import "./styles/employees.css";
import "./styles/assignments.css";
import "./styles/profile.css";
import "./styles/navbar.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  
    <App />
 
);