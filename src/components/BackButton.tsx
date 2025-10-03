import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
}

const BackButton = ({ className = "", variant = "ghost" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      onClick={() => navigate(-1)}
      className={`gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackButton;
