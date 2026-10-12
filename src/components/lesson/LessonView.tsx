"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, Trophy } from "lucide-react";
import type { Lesson, Problem } from "@/lib/types";
import { LessonWidget } from "@/components/math/LessonWidget";
import { LessonDemo } from "@/components/demos/LessonDemo";
import { MathRenderer, MathText } from "@/components/math/MathRenderer";
import { ProblemCard } from "@/components/practice/ProblemCard";
import { CopilotPanel } from "@/components/ai/CopilotPanel";
import { CopilotDrawer } from "@/components/ai/CopilotDrawer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useHydrated } from "@/components/layout/StatChips";
import { useProgress } from "@/store/progress";
import { useTutor } from "@/store/tutor";

type Props = {
  topic: string;
  courseTitle: string;
  lesson: Lesson;
  index: number;
  total: number;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

const ctxFor = (p: Problem) => ({ problem: p.prompt, answers: p.answers ?? [], hints: p.hints, socratic: p.socratic });

export function LessonView({ topic, courseTitle, lesson, index, total, prev, next }: Props) {
  const ready = useHydrated();
  const completed = useProgress((s) => s.completed);
  const markSolved = useProgress((s) => s.markSolved);
  const visit = useProgress((s) => s.visit);
  const { focus, send, setOpen } = useTutor();

  const solved = ready ? lesson.problems.filter((p) => completed[p.id]).length : 0;
  const allDone = solved === lesson.problems.length;

  // Remember where the student is for the "Continue learning" banner
  useEffect(() => {
    if (ready) visit({ topic, lesson: lesson.slug, title: lesson.title });
  }, [ready, topic, lesson.slug, lesson.title, visit]);

  // Point the tutor at the first problem so the chat is usable immediately
  useEffect(() => { focus(ctxFor(lesson.problems[0])); }, [lesson, focus]);

  return (
    <div className="lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden">
      <div className="border-b border-border bg-bg/60 px-6 py-3">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4">
          <Link href="/#topics" className="text-sm text-muted hover:text-fg"><ArrowLeft className="mr-1 inline size-4" />{courseTitle}</Link>
          <span className="text-sm text-muted">Lesson {index + 1} of {total}</span>
          <div className="ml-auto flex w-48 items-center gap-3">
            <ProgressBar value={(solved / lesson.problems.length) * 100} label="Lesson progress" />
            <span className="text-xs tabular-nums text-muted">{solved}/{lesson.problems.length}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-0 lg:h-[calc(100%-3.1rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_340px]">
        {/* Left: concept + interactive widget */}
        <section className="space-y-4 px-6 py-6 lg:overflow-y-auto" aria-label="Concept">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
            <p className="mt-1 text-sm text-muted">{lesson.summary} · {lesson.minutes} min</p>
            {lesson.level && (
              <p className="mt-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
                <span className="font-medium text-fg">{lesson.level === "research" ? "Research-level topic." : "Advanced topic."}</span>{" "}
                This lesson builds intuition with simplified examples and toy models. The full theory needs university-level background.
              </p>
            )}
          </div>
          {lesson.concept.map((b, i) =>
            b.type === "p" ? <p key={i} className="leading-relaxed"><MathText text={b.text} /></p> :
            b.type === "math" ? <MathRenderer key={i} tex={b.tex} display className="text-xl" /> :
            <Card key={i} className="border-accent/40 bg-accent/5 p-4">
              <p className="mb-1 text-sm font-semibold text-accent">{b.title}</p>
              <p className="text-sm leading-relaxed"><MathText text={b.text} /></p>
            </Card>,
          )}
          {lesson.widget && <LessonWidget widget={lesson.widget} key={lesson.slug} />}
          {lesson.demo && <LessonDemo kind={lesson.demo} key={lesson.slug} />}
        </section>

        {/* Center: practice */}
        <section className="space-y-4 border-border px-6 py-6 lg:overflow-y-auto lg:border-x" aria-label="Practice">
          <h2 className="text-lg font-semibold tracking-tight">Practice</h2>
          {lesson.problems.map((p, i) => (
            <div key={p.id} onFocusCapture={() => focus(ctxFor(p))}>
              <ProblemCard problem={p} index={i} done={ready && !!completed[p.id]}
                onSolved={(pr) => markSolved(pr.id, pr.xp)}
                onStuck={(pr, attempts) => { focus(ctxFor(pr)); void send(attempts.length ? `I tried ${attempts[attempts.length - 1]} and I'm stuck` : "I'm stuck"); }} />
            </div>
          ))}
          {allDone && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-success/50 bg-success/10 p-5 text-center">
                <Trophy className="mx-auto mb-2 size-8 text-amber-400" />
                <p className="font-semibold">Lesson complete!</p>
                <div className="mt-3 flex justify-center gap-2">
                  {next ? <ButtonLink href={`/learn/${topic}/${next.slug}`} variant="accent">Next: {next.title} <ArrowRight className="size-4" /></ButtonLink>
                        : <ButtonLink href="/dashboard" variant="accent">View your mastery <ArrowRight className="size-4" /></ButtonLink>}
                </div>
              </Card>
            </motion.div>
          )}
          <nav className="flex justify-between pt-2 text-sm text-muted">
            {prev ? <Link href={`/learn/${topic}/${prev.slug}`} className="hover:text-fg">← {prev.title}</Link> : <span />}
            {next && <Link href={`/learn/${topic}/${next.slug}`} className="hover:text-fg">{next.title} →</Link>}
          </nav>
        </section>

        {/* Right: MathCopilot, docked on desktop */}
        <aside className="hidden min-h-0 bg-surface/50 lg:block" aria-label="MathCopilot">
          <CopilotPanel />
        </aside>
      </div>

      {/* Narrow screens: floating button + drawer */}
      <button onClick={() => setOpen(true)} aria-label="Open MathCopilot"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg lg:hidden">
        <Bot className="size-4" /> MathCopilot
      </button>
      <CopilotDrawer />
    </div>
  );
}
