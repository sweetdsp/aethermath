"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lightbulb, MessageCircleQuestion, XCircle } from "lucide-react";
import { useState } from "react";
import type { Problem } from "@/lib/types";
import { checkAnswer } from "@/lib/expr";
import { MathText } from "@/components/math/MathRenderer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Status = "idle" | "correct" | "wrong" | "invalid";

type Props = {
  problem: Problem;
  index?: number;
  onSolved?: (p: Problem, attempts: number, hintsUsed: number) => void;
  /** Called when the student asks the tutor for help */
  onStuck?: (p: Problem, attempts: string[], hintsShown: number) => void;
};

export function ProblemCard({ problem, index, onSolved, onStuck }: Props) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [hints, setHints] = useState(0);
  const solved = status === "correct";

  const submit = () => {
    if (solved) return;
    let ok = false, text = input.trim();
    if (problem.kind === "choice") {
      if (picked === null) return;
      text = problem.choices![picked];
      ok = picked === problem.correctIndex;
    } else {
      if (!text) return;
      const r = checkAnswer(text, problem.answers ?? []);
      if (!r.ok && r.reason === "parse") { setStatus("invalid"); setError(r.message); return; }
      ok = r.ok;
    }
    const tries = [...attempts, text];
    setAttempts(tries);
    setStatus(ok ? "correct" : "wrong");
    if (ok) onSolved?.(problem, tries.length, hints);
  };

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>{index !== undefined ? `Problem ${index + 1}` : "Problem"}</span>
        <span>+{problem.xp} XP</span>
      </div>
      <p className="text-lg leading-relaxed"><MathText text={problem.prompt} /></p>

      <div className="mt-4">
        {problem.kind === "choice" ? (
          <div role="radiogroup" className="grid gap-2">
            {problem.choices!.map((c, i) => (
              <button key={i} role="radio" aria-checked={picked === i} disabled={solved}
                onClick={() => { setPicked(i); setStatus("idle"); }}
                className={cn("rounded-xl border px-4 py-2.5 text-left transition-colors",
                  picked === i ? "border-accent bg-accent/10" : "border-border hover:bg-surface-2",
                  solved && i === problem.correctIndex && "border-success bg-success/10")}>
                <MathText text={c} />
              </button>
            ))}
          </div>
        ) : (
          <input value={input} disabled={solved} spellCheck={false} autoComplete="off" aria-label="Your answer"
            onChange={(e) => { setInput(e.target.value); setStatus("idle"); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Type your answer, e.g. 2x + 1"
            className={cn("h-12 w-full rounded-xl border bg-bg px-4 font-mono text-base outline-none transition-colors focus:border-accent",
              status === "wrong" && "border-danger", status === "correct" ? "border-success" : status !== "wrong" && "border-border")} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="accent" onClick={submit} disabled={solved || (problem.kind === "choice" ? picked === null : !input.trim())}>Check</Button>
        <Button variant="ghost" disabled={solved || hints >= problem.hints.length} onClick={() => setHints((h) => h + 1)}>
          <Lightbulb className="size-4" /> Hint {hints > 0 && `(${hints}/${problem.hints.length})`}
        </Button>
        <Button variant="subtle" disabled={solved} onClick={() => onStuck?.(problem, attempts, hints)}>
          <MessageCircleQuestion className="size-4" /> Ask MathCopilot
        </Button>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {hints > 0 && !solved && (
          <motion.ul key="hints" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-2 overflow-hidden">
            {problem.hints.slice(0, hints).map((h, i) => (
              <li key={i} className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm"><MathText text={h} /></li>
            ))}
          </motion.ul>
        )}
        {status !== "idle" && (
          <motion.div key={status + attempts.length} role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={cn("mt-4 flex gap-2 rounded-xl px-3 py-2.5 text-sm",
              solved ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
            {solved ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <XCircle className="mt-0.5 size-4 shrink-0" />}
            <div className="text-fg">
              {solved && <><p className="font-medium text-success">Correct! Any equivalent form works.</p><p className="mt-1 text-muted"><MathText text={problem.explanation} /></p></>}
              {status === "wrong" && <p>Not quite. Try a hint or ask MathCopilot to walk you through it.</p>}
              {status === "invalid" && <p>I couldn&apos;t read that: {error}.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
