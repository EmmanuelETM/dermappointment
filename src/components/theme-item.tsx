import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeItem = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const inverse = currentTheme === "dark" ? "light" : "dark";

  return (
    <DropdownMenuItem
      className="rounded-sm py-1 hover:bg-accent"
      onClick={() => setTheme(inverse)}
    >
      <div className="flex cursor-pointer items-center gap-2 pl-2 text-sm">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        {theme === "dark" ? "Light Theme" : "Dark Theme"}
      </div>
    </DropdownMenuItem>
  );
};
