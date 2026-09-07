import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "@fontsource-variable/instrument-sans";
import "./styles.css";
import "./foundation-system.css";

const container = document.getElementById("root");
const render = container.hasChildNodes() ? (app) => hydrateRoot(container, app) : (app) => createRoot(container).render(app);
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
