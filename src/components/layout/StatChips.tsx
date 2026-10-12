"use client";

import { Flame, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress";
import { Badge } from "@/components/ui/Card";

/** Rehydrates the persisted store after mount to avoid SSR/client mismatches. */
export function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    void Promise.resolve(useProgress.persist.rehydrate()).then(() => setOk(true));
  }, []);
  return ok;
}

export function StatChips() {
  const ready = useHydrated();
  const { xp, streak } = useProgress();
  return (
    <div className="hidden items-center gap-2 sm:flex" aria-label="Your stats">
      <Badge className={streak > 0 ? "text-amber-500" : ""}>
        <Flame className="size-3.5" /> {ready ? streak : 0}
      </Badge>
      <Badge>
        <Zap className="size-3.5 text-accent" /> {ready ? xp : 0} XP
      </Badge>
    </div>
  );
}
