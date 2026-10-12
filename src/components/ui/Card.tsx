import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-surface/80 backdrop-blur", className)}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted",
        className,
      )}
      {...props}
    />
  );
}
