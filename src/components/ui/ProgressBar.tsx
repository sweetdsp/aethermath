"use client";

import { motion } from "framer-motion";

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      />
    </div>
  );
}
