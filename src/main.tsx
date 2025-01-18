import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
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
    <HeroUIProvider
      className={`${
        isDarkModeEnabled() ? "dark" : "light"
      } text-foreground bg-background`}
    >
      <OsmAuthProvider>
        <App />
      </OsmAuthProvider>
    </HeroUIProvider>
  </React.StrictMode>,
);
