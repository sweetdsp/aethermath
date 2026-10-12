"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTutor } from "@/store/tutor";
import { CopilotPanel } from "./CopilotPanel";

/** Slide-in wrapper around CopilotPanel for narrow screens / standalone use. */
export function CopilotDrawer() {
  const { open, setOpen } = useTutor();
  return (
    <AnimatePresence>
      {open && (
        <motion.aside role="dialog" aria-label="MathCopilot"
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed inset-y-0 right-0 z-50 lg:hidden w-full max-w-sm border-l border-border bg-bg shadow-2xl">
          <button onClick={() => setOpen(false)} aria-label="Close tutor" className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"><X className="size-4" /></button>
          <CopilotPanel />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
