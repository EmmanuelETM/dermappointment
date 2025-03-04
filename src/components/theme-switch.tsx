"use client";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const inverse = currentTheme === "dark" ? "light" : "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {mounted && (
        <Switch
          checked={inverse === "light"}
          onCheckedChange={() => setTheme(inverse)}
        />
      )}
      {mounted && inverse === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </div>
  );
}
