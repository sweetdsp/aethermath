# AetherMath

Interactive math learning: live graphs, algebra-aware practice, and a Socratic AI tutor.
Next.js (App Router, TS) · Tailwind v4 · Framer Motion · KaTeX · Zustand.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Layout
- `src/app` – routes: `/`, `/learn/[topic]/[lesson]`, `/dashboard`
- `src/components/{math,ai,practice,ui,layout}` – reusable components
- `src/data` – mock course content · `src/store` – Zustand stores · `src/lib` – helpers
