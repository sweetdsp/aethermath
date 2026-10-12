"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/store/progress";
import { useHydrated } from "./StatChips";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ContinueBanner() {
  const ready = useHydrated();
  const last = useProgress((s) => s.last);
  if (!ready || !last) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <PlayCircle className="size-8 text-accent" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Continue learning</p>
            <p className="font-medium">{last.title}</p>
          </div>
        </div>
        <ButtonLink href={`/learn/${last.topic}/${last.lesson}`} variant="accent">
          Resume <ArrowRight className="size-4" />
        </ButtonLink>
      </Card>
    </motion.div>
  );
}
