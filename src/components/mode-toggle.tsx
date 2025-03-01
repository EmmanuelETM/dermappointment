"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evita el hydration mismatch asegurando que se renderiza solo en el cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita mostrar contenido diferente entre SSR y CSR

  const inverse = theme === "dark" ? "light" : "dark";

  return (
    <DropdownMenuItem onClick={() => setTheme(inverse)}>
      {inverse === "dark" ? <Moon /> : <Sun />}
      {inverse === "dark" ? "Dark" : "Light"}
    </DropdownMenuItem>
  );
}
