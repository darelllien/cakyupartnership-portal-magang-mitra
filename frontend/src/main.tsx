import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/App.css";
import App from "./App.tsx";

axios.defaults.baseURL = "http://localhost:5000";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
