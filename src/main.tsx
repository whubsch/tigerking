import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/system";
import App from "./App";
import { OsmAuthProvider } from "./contexts/AuthContext";
import "./index.css";

function isDarkModeEnabled(): boolean {
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider
      className={`${
        isDarkModeEnabled() ? "dark" : "light"
      } text-foreground bg-background`}
    >
      <OsmAuthProvider>
        <App />
      </OsmAuthProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
