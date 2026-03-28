import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors group"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 group-hover:text-slate-900 transition-colors" />
      )}
    </button>
  );
}

export default ThemeButton;
