import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface PressmasterModeBadgeProps {
  isLive: boolean;
}

export const PressmasterModeBadge = ({ isLive }: PressmasterModeBadgeProps) => {
  return (
    <Badge
      variant={isLive ? "default" : "secondary"}
      className={
        isLive
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-500 hover:bg-gray-600 text-white"
      }
    >
      {isLive ? (
        <>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Live
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3 mr-1" />
          Stub
        </>
      )}
    </Badge>
  );
};
