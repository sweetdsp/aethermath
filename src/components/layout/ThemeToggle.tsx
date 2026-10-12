"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
};
const isDark = () => {
  const c = document.documentElement.classList;
  if (c.contains("dark")) return true;
  if (c.contains("light")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const root = document.documentElement;
    const next = !isDark();
    root.classList.toggle("dark", next);
    root.classList.toggle("light", !next);
    try {
      localStorage.setItem("aether-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
