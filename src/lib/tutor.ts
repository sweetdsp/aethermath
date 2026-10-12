import { checkAnswer } from "./expr";

export type TutorContext = {
  problem: string;
  answers: string[];
  hints: string[];
  socratic: string[];
};
export type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const WANTS_ANSWER = /(tell|give|show|reveal).{0,20}(answer|solution)|what('?s| is) the (answer|solution)|just solve/i;
const LOOKS_LIKE_MATH = /^[\s\d+\-*/^().=xyXY,a-z]*$/i;

/**
 * Mock Socratic tutor. Swap the body for a real LLM call later; the
 * signature (context + history + message → reply) is the integration seam.
 */
export async function askTutor(ctx: TutorContext, history: ChatMessage[], text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));
  const step = history.filter((m) => m.role === "assistant").length;
  const q = ctx.socratic[step % Math.max(ctx.socratic.length, 1)] ?? "What is the problem really asking you to find?";
  const hint = ctx.hints[Math.min(step, ctx.hints.length - 1)];

  if (WANTS_ANSWER.test(text)) {
    return `I'll keep the answer to myself, since you'll remember it better if you find it. But here's a nudge: ${hint ?? q}\n\n${q}`;
  }
  const looksMath = /\d|x|y/i.test(text) && LOOKS_LIKE_MATH.test(text) && !/\b(help|hint|why|how|stuck)\b/i.test(text);
  if (looksMath) {
    const r = checkAnswer(text.trim(), ctx.answers);
    if (r.ok) return "That works. Before you submit it: can you explain *why* each step is allowed?";
    return `Not quite, but test it instead of trusting me: pick an easy value like $x=0$ or $x=1$. Does your expression give the same result as the problem does?\n\n${q}`;
  }
  if (/\b(hint|stuck|help|don'?t (know|get|understand))\b/i.test(text)) return `Let's go smaller. ${q}`;
  if (/\bwhy\b/i.test(text)) return `Good instinct to ask why. What happens if you change one number and watch the graph? ${q}`;
  return q;
}
