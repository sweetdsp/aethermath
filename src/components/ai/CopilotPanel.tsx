"use client";

import { Bot, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTutor } from "@/store/tutor";
import { MathText } from "@/components/math/MathRenderer";
import { cn } from "@/lib/cn";

const QUICK = ["Give me a hint", "I'm stuck", "Why does that work?"];

export function CopilotPanel({ className }: { className?: string }) {
  const { messages, typing, send, context } = useTutor();
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, typing]);

  const submit = (t: string) => { if (t.trim()) { void send(t); setText(""); } };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white"><Bot className="size-4" /></span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">MathCopilot</p>
          <p className="text-xs text-muted">Asks questions, never hands out answers</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {!context && <p className="text-sm text-muted">Open a practice problem and ask for help. I&apos;ll guide you step by step.</p>}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={cn("max-w-[88%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                m.role === "user" ? "ml-auto bg-accent text-white" : "bg-surface-2")}>
              <MathText text={m.text} />
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex w-fit gap-1 rounded-2xl bg-surface-2 px-3.5 py-3" aria-label="MathCopilot is typing">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="size-1.5 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={end} />
      </div>
      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button key={q} disabled={!context || typing} onClick={() => submit(q)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:text-fg disabled:opacity-40">{q}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); submit(text); }} className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={!context} placeholder="Ask or try an idea…" aria-label="Message MathCopilot"
            className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-accent disabled:opacity-50" />
          <button type="submit" disabled={!context || typing || !text.trim()} aria-label="Send"
            className="grid size-10 place-items-center rounded-xl bg-accent text-white disabled:opacity-40"><Send className="size-4" /></button>
        </form>
      </div>
    </div>
  );
}
