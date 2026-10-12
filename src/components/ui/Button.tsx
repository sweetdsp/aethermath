import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants = {
  primary: "bg-fg text-bg hover:opacity-90 shadow-sm",
  accent: "bg-accent text-white hover:brightness-110 shadow-[0_0_24px_-6px_var(--accent)]",
  ghost: "border border-border bg-surface hover:bg-surface-2",
  subtle: "text-muted hover:text-fg hover:bg-surface-2",
} as const;

const sizes = { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6 text-base" } as const;

type Common = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
