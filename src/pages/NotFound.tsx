import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-background relative">
      <BackButton className="absolute top-4 left-4 glass-card" />
      <div className="text-center glass-card p-8 max-w-md mx-4">
        <h1 className="mb-4 text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <p className="mb-6 text-xl text-foreground/80">Oops! Page not found</p>
        <p className="mb-6 text-foreground/60">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="text-highlight hover:text-highlight/80 underline transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
