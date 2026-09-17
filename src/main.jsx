import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "@fontsource-variable/instrument-sans";
import "./styles.css";
import "./foundation-system.css";
import "./editorial.css";
import "./homepage-evidence.css";
import "./institutional-refinements.css";
import "./visibility-capability.css";
import "./engage-opportunity.css";

const container = document.getElementById("root");
const render = container.hasChildNodes() ? (app) => hydrateRoot(container, app) : (app) => createRoot(container).render(app);
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
