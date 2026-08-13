import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export const ScrollToBottom = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;
      setVisible(!nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        })
      }
      aria-label="Aller en bas de page"
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110 card-interactive"
    >
      <ArrowDown size={20} />
    </button>
  );
};
