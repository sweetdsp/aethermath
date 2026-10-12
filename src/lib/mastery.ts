export type Level = "new" | "novice" | "proficient" | "mastered";

export const LEVELS: Record<Level, { label: string; color: string }> = {
  new: { label: "Not started", color: "var(--muted)" },
  novice: { label: "Novice", color: "#f59e0b" },
  proficient: { label: "Proficient", color: "var(--accent)" },
  mastered: { label: "Mastered", color: "var(--success)" },
};

/** Mastery from the share of a lesson's problems solved: <75% Novice, ≥75% Proficient, 100% Mastered. */
export function levelFor(solved: number, total: number): Level {
  if (total <= 0 || solved <= 0) return "new";
  if (solved >= total) return "mastered";
  return solved / total >= 0.75 ? "proficient" : "novice";
}
