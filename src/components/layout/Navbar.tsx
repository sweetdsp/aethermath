import Link from "next/link";
import { Atom } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { StatChips } from "./StatChips";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white">
            <Atom className="size-4" />
          </span>
          AetherMath
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/#topics" className="rounded-lg px-3 py-1.5 text-muted hover:text-fg">
            Topics
          </Link>
          <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-muted hover:text-fg">
            Dashboard
          </Link>
          <span className="mx-2 hidden h-5 w-px bg-border sm:block" />
          <StatChips />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
