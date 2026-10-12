"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { topics } from "@/data/topics";
import { Badge, Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function TopicGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {topics.map((t, i) => {
        const Icon = t.icon;
        const href = t.firstLesson ? `/learn/${t.slug}/${t.firstLesson}` : null;
        const inner = (
          <Card
            className={cn(
              "group relative h-full overflow-hidden p-6 transition-colors",
              href ? "hover:border-accent/60" : "opacity-70",
            )}
          >
            <div
              className={cn("absolute inset-0 -z-0 bg-gradient-to-br opacity-60", t.gradient)}
              aria-hidden
            />
            <div className="relative">
              <div className="mb-8 flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-bg/70">
                  <Icon className="size-5" />
                </span>
                {href ? (
                  <ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                ) : (
                  <Badge>Coming soon</Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-1 text-sm text-muted">{t.tagline}</p>
              {href && <p className="mt-4 text-xs text-muted">{t.lessons} lessons</p>}
            </div>
          </Card>
        );
        return (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06 }}
            whileHover={href ? { y: -3 } : undefined}
          >
            {href ? (
              <Link href={href} className="block h-full rounded-2xl">
                {inner}
              </Link>
            ) : (
              inner
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
