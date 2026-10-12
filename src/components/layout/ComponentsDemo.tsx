"use client";

import { useState } from "react";
import { InteractiveGraph } from "@/components/math/InteractiveGraph";
import { MathRenderer } from "@/components/math/MathRenderer";
import { ProblemCard } from "@/components/practice/ProblemCard";
import { CopilotDrawer } from "@/components/ai/CopilotDrawer";
import { useTutor } from "@/store/tutor";
import { useProgress } from "@/store/progress";
import type { Problem } from "@/lib/types";

const sample: Problem = {
  id: "demo-1", kind: "expression", xp: 10,
  prompt: "Write the line with slope $2$ that passes through $(0, 1)$ as $y = \\dots$",
  answers: ["y=2x+1"],
  hints: ["A line is $y = mx + b$. What is $m$ here?", "$b$ is where the line crosses the y-axis."],
  socratic: ["What does the slope tell you about how $y$ changes when $x$ goes up by 1?", "Where does the line cross the y-axis, and which letter represents that?"],
  explanation: "Slope $m=2$ and intercept $b=1$ give $y = 2x + 1$.",
};

export function ComponentsDemo() {
  const [m, setM] = useState(2), [b, setB] = useState(1), [tx, setTx] = useState(1);
  const focus = useTutor((s) => s.focus), send = useTutor((s) => s.send);
  const addXp = useProgress((s) => s.addXp);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <MathRenderer tex={`y = ${m}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`} display className="text-2xl" />
        <InteractiveGraph
          plots={[{ fn: (x) => m * x + b, label: "line" }, { fn: (x) => x * x / 4 - 2, color: "var(--danger)", label: "parabola" }]}
          points={[{ x: 0, y: b, label: "b", onDrag: (_x, y) => setB(Math.round(y * 2) / 2) }]}
          tracer={{ plot: 1, x: tx, onChange: setTx, showTangent: true }}
        />
        <label className="flex items-center gap-3 text-sm">slope m
          <input type="range" min={-5} max={5} step={0.5} value={m} onChange={(e) => setM(+e.target.value)} className="flex-1 accent-[var(--accent)]" />
          <span className="w-8 tabular-nums">{m}</span></label>
      </div>
      <ProblemCard problem={sample} index={0}
        onSolved={(p) => addXp(p.xp)}
        onStuck={(p, attempts) => {
          focus({ problem: p.prompt, answers: p.answers ?? [], hints: p.hints, socratic: p.socratic });
          void send(attempts.length ? `I tried ${attempts[attempts.length - 1]} and I'm stuck` : "I'm stuck");
        }} />
      <CopilotDrawer />
    </div>
  );
}
