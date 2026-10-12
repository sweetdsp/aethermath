"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.5, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute left-1/2 top-[-12rem] -z-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <motion.div {...fade(0)}>
          <Badge className="mb-6">
            <Sparkles className="size-3.5 text-accent" /> Socratic AI tutor · live graphs
          </Badge>
        </motion.div>
        <motion.h1
          {...fade(1)}
          className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          Don&apos;t just read math.{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            Move it.
          </span>
        </motion.h1>
        <motion.p {...fade(2)} className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted">
          Drag a slider and watch the equation redraw. Get stuck and a tutor asks the right
          question, not the answer.
        </motion.p>
        <motion.div {...fade(3)} className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/#topics" size="lg" variant="accent">
            Start learning <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/dashboard" size="lg" variant="ghost">
            View mastery map
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
