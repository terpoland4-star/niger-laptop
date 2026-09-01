import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./animations.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch(error => {
    console.error("Service Worker registration failed:", error);
  });
}

hydrateRoot(document.getElementById("root")!, <App />);
