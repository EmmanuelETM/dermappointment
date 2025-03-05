"use client";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { setTheme, theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const inverse = currentTheme === "dark" ? "light" : "dark";

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={inverse === "light"}
        onCheckedChange={() => setTheme(inverse)}
      />
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </div>
  );
}
