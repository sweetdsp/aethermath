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

/** Rich-text-lite blocks for the concept pane. Math goes in $...$ inside text. */
export type Block =
  | { type: "p"; text: string }
  | { type: "math"; tex: string }
  | { type: "callout"; title: string; text: string };

export type Slider = { key: string; label: string; min: number; max: number; step: number; initial: number };

/**
 * Declarative interactive widget. Expressions use `x` plus any slider keys.
 * `equation` is LaTeX with [[expr]] (value), [[+expr]] (signed, e.g. "+ 3"),
 * [[*expr]] (coefficient: 1→"", -1→"-") and [[=expr]] (computed) slots.
 */
export type Widget = {
  sliders: Slider[];
  plots: { expr: string; color?: string; label?: string; dashed?: boolean }[];
  equation: string;
  xRange?: [number, number];
  yRange?: [number, number];
  /** A point riding a plot; dragging it sets slider `param` */
  tracer?: { plot: number; param: string; tangent?: boolean };
  /** Secant through x and x+h on a plot */
  secant?: { plot: number; x: string; h: string };
  /** Points from expressions; `drag` binds dragging to two slider keys */
  points?: { x: string; y: string; label?: string; drag?: { x: string; y: string } }[];
  readouts?: { label: string; expr?: string; derivativeOf?: { plot: number; at: string } }[];
  caption?: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  concept: Block[];
  widget: Widget;
  problems: Problem[];
};

export type Course = { topic: string; title: string; lessons: Lesson[] };
