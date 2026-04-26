import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

if (typeof window !== "undefined") {
  console.log(
    "%c👋 hi there.",
    "font:700 28px/1.2 'Space Grotesk',system-ui,sans-serif;color:#ff6b35;padding:8px 0;"
  );
  console.log(
    "%cif you're poking around in here, you've got the right kind of curiosity.\n%cdrop a line — jonny@oovra.net",
    "font:13px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#9a9aa8;",
    "font:13px/1.6 'JetBrains Mono',ui-monospace,monospace;color:#5fc9f8;"
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
