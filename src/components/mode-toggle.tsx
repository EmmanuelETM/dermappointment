"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const inverse = theme == "dark" ? "light" : "dark";

  return (
    <DropdownMenuItem onClick={() => setTheme(inverse)}>
      {inverse == "dark" ? <Moon /> : <Sun />}
      {inverse == "dark" ? "Dark" : "Light"}
    </DropdownMenuItem>
  );
}
