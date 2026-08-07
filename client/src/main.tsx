import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./animations.css";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch(error => {
    console.error("Service Worker registration failed:", error);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
