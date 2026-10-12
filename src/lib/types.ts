export type Problem = {
  id: string;
  /** Prompt text; wrap math in $...$ */
  prompt: string;
  kind: "expression" | "choice";
  /** expression: accepted answers (any algebraically equivalent form matches) */
  answers?: string[];
  /** choice: options (may contain $...$) and the index of the right one */
  choices?: string[];
  correctIndex?: number;
  /** Progressive hints, gentlest first */
  hints: string[];
  /** Leading questions the tutor can ask instead of giving the answer */
  socratic: string[];
  explanation: string;
  xp: number;
};
