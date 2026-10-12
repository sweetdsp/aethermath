"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Lock, Target, Trophy, Zap } from "lucide-react";
import { courses } from "@/data/courses";
import { topics } from "@/data/topics";
import { levelFor, LEVELS } from "@/lib/mastery";
import { useProgress } from "@/store/progress";
import { useHydrated } from "@/components/layout/StatChips";
import { Badge, Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";

function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" className="size-11 -rotate-90" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <motion.circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct) }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </svg>
  );
}

export function DashboardView() {
  const ready = useHydrated();
  const { xp, streak, completed } = useProgress();
  const done = (id: string) => ready && !!completed[id];

  const lessons = courses.flatMap((c) => c.lessons);
  const rows = lessons.map((l) => ({ l, solved: l.problems.filter((p) => done(p.id)).length }));
  const mastered = rows.filter((r) => levelFor(r.solved, r.l.problems.length) === "mastered").length;
  const solvedTotal = rows.reduce((n, r) => n + r.solved, 0);
  const problemTotal = rows.reduce((n, r) => n + r.l.problems.length, 0);

  const stats = [
    { icon: Zap, label: "Total XP", value: ready ? xp : 0 },
    { icon: Flame, label: "Day streak", value: ready ? streak : 0 },
    { icon: Target, label: "Problems solved", value: `${solvedTotal}/${problemTotal}` },
    { icon: Trophy, label: "Lessons mastered", value: `${mastered}/${lessons.length}` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your mastery map</h1>
      <p className="mt-1 text-muted">Solve every problem in a lesson to master it.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="p-4">
            <Icon className="mb-3 size-5 text-accent" />
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs" aria-label="Legend">
        {Object.values(LEVELS).map((lv) => (
          <Badge key={lv.label}><span className="size-2 rounded-full" style={{ background: lv.color }} />{lv.label}</Badge>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {topics.map((t) => {
          const course = courses.find((c) => c.topic === t.slug);
          const Icon = t.icon;
          const trow = course ? course.lessons.map((l) => ({ l, solved: l.problems.filter((p) => done(p.id)).length })) : [];
          const pct = trow.length ? (trow.reduce((n, r) => n + r.solved, 0) / trow.reduce((n, r) => n + r.l.problems.length, 0)) * 100 : 0;
          return (
            <section key={t.slug} aria-label={t.title}>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface"><Icon className="size-4" /></span>
                <div className="flex-1">
                  <h2 className="font-semibold tracking-tight">{t.title}</h2>
                  <p className="text-xs text-muted">{course ? course.title : "Coming soon"}</p>
                </div>
                {course && <div className="w-40"><ProgressBar value={pct} label={`${t.title} progress`} /></div>}
              </div>

              {course ? (
                <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {trow.map(({ l, solved }, i) => {
                    const level = levelFor(solved, l.problems.length), lv = LEVELS[level];
                    return (
                      <motion.li key={l.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="relative">
                        {i < trow.length - 1 && <span aria-hidden className="absolute left-full top-1/2 hidden h-px w-3 bg-border lg:block" />}
                        <Link href={`/learn/${t.slug}/${l.slug}`} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-accent">
                          <Card className={cn("h-full p-4 transition-colors hover:border-accent/60")} style={level !== "new" ? { borderColor: `color-mix(in oklab, ${lv.color} 45%, var(--border))` } : undefined}>
                            <div className="flex items-start justify-between">
                              <div className="relative">
                                <Ring pct={solved / l.problems.length} color={lv.color} />
                                <span className="absolute inset-0 grid place-items-center text-xs font-medium tabular-nums">{solved}/{l.problems.length}</span>
                              </div>
                              <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: lv.color, background: `color-mix(in oklab, ${lv.color} 14%, transparent)` }}>{lv.label}</span>
                            </div>
                            <p className="mt-3 text-sm font-medium leading-snug">{l.title}</p>
                          </Card>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ol>
              ) : (
                <Card className="flex items-center gap-3 p-4 text-sm text-muted"><Lock className="size-4" /> This topic is on the way.</Card>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
