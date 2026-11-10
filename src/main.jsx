import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
// Global styles first, so component styles win when the two overlap.
import "./styles/global.css";
import App from "./App.jsx";

console.log(
  "%c👋 hi there.",
  "font:700 28px/1.2 'Space Grotesk',system-ui,sans-serif;color:#ff6b35;padding:8px 0;"
);
console.log(
  "%cif you're poking around in here, you've got the right kind of curiosity.\n%cthere are five bugs hiding on this page. the terminal knows more (try `bugs`).\n%cdrop a line — jonny@oovra.net",
  "font:13px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#9a9aa8;",
  "font:13px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#ffd166;",
  "font:13px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#5fc9f8;"
);

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs), so hydrate it.
// The dev server ships an empty root and renders from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

// Tells the inline script in index.html that scroll reveals are safe to keep.
window.__ready = true;
