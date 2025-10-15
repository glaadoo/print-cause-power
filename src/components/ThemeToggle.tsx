import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Cycle through: light -> dark -> light
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If system, switch to opposite of current system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "light" : "dark");
    }
  };

  const isDark = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-primary-foreground hover:bg-white/10 transition-all duration-150"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-150 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-150 rotate-0 scale-100" />
      )}
    </Button>
  );
}
