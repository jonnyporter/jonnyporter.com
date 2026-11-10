import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

/** Used at build time by scripts/prerender.mjs to bake the page into index.html. */
export function render() {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
