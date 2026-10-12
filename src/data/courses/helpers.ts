import type { Problem } from "@/lib/types";

/** Free-form answer problem: any algebraically equivalent answer is accepted. */
export const ex = (
  id: string, prompt: string, answers: string[], hints: string[], socratic: string[], explanation: string, xp = 10,
): Problem => ({ id, kind: "expression", prompt, answers, hints, socratic, explanation, xp });

/** Multiple choice problem. */
export const mc = (
  id: string, prompt: string, choices: string[], correctIndex: number,
  hints: string[], socratic: string[], explanation: string, xp = 5,
): Problem => ({ id, kind: "choice", prompt, choices, correctIndex, hints, socratic, explanation, xp });
