import { useEffect } from "react";

export const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("Service Worker registered successfully:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error);
        });

      // Listen for controller change (new Service Worker activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("Service Worker controller changed");
        // Optionally show a notification to the user about the update
      });
    }
  }, []);
};
