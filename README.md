# AetherMath

Interactive math learning: live graphs, algebra-aware practice, and a Socratic AI tutor.
Next.js (App Router, TS) · Tailwind v4 · Framer Motion · KaTeX · Zustand.

```bash
npm install
npm run dev       # http://localhost:3000
npm run check     # typecheck + validate course data + production build
```

## Routes
- `/` landing page, topic picker, "Continue learning"
- `/learn/[topic]/[lesson]` concept + live widget | practice | MathCopilot
- `/dashboard` mastery map (Novice < 75% · Proficient ≥ 75% · Mastered 100% of a lesson's problems)

## Layout
- `src/lib/expr.ts` expression parser and algebraic-equivalence checker (accepts any equivalent form)
- `src/lib/tutor.ts` `askTutor()`: mock Socratic tutor; replace its body with an LLM call
- `src/data/courses/` lesson content; `src/store/` Zustand stores (progress is persisted in localStorage)
- `src/components/{math,practice,ai,lesson,dashboard,layout,ui}`

## Adding a lesson
Add an entry to `src/data/courses/<topic>.ts` (concept blocks, a declarative `widget`, problems built with
`ex()` / `mc()`), then run `npm run validate`. Widget expressions use `x` plus slider keys; equation LaTeX
uses `[[expr]]`, `[[+expr]]`, `[[*expr]]`, `[[=expr]]` slots (see `src/lib/types.ts`).
