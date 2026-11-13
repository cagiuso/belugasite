import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "lenis/dist/lenis.css";
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/motion.css";
import "./styles/presentation.css";
import "./styles/editorial.css";
import "./styles/readability.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
