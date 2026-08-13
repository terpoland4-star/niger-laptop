import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({
  to = "/",
  label = "Retour",
  className = "",
}: BackButtonProps) => {
  const [, navigate] = useLocation();

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};
