import { courses } from "../src/data/courses";
import { checkAnswer, compile } from "../src/lib/expr";

let errors = 0;
const bad = (msg: string) => { errors++; console.error("✗", msg); };
const ids = new Set<string>();

for (const c of courses) {
  const slugs = new Set<string>();
  for (const l of c.lessons) {
    const where = `${c.topic}/${l.slug}`;
    if (slugs.has(l.slug)) bad(`${where}: duplicate slug`);
    slugs.add(l.slug);
    const keys = l.widget.sliders.map((s) => s.key);
    const sample = Object.fromEntries(keys.map((k) => [k, l.widget.sliders.find((s) => s.key === k)!.initial]));
    const exprs = [...l.widget.plots.map((p) => p.expr), ...(l.widget.points ?? []).flatMap((p) => [p.x, p.y]),
      ...(l.widget.readouts ?? []).flatMap((r) => (r.expr ? [r.expr] : []))];
    for (const t of l.widget.equation.matchAll(/\[\[[+*=]?([^\]]+)\]\]/g)) exprs.push(t[1]);
    for (const e of exprs) {
      try {
        const k = compile(e, keys);
        const unknown = k.vars.filter((v) => v !== "x" && !keys.includes(v));
        if (unknown.length) bad(`${where}: "${e}" uses unknown variable(s) ${unknown}`);
        else if (!Number.isFinite(k.fn({ ...sample, x: 1.3 }))) console.warn(`! ${where}: "${e}" is not finite at the initial values`);
      } catch (err) { bad(`${where}: "${e}" does not parse (${(err as Error).message})`); }
    }
    for (const p of l.problems) {
      if (ids.has(p.id)) bad(`${p.id}: duplicate problem id`);
      ids.add(p.id);
      if (!p.hints.length || !p.socratic.length) bad(`${p.id}: needs hints and socratic questions`);
      if (p.kind === "choice") {
        if (p.correctIndex === undefined || !p.choices?.[p.correctIndex]) bad(`${p.id}: bad correctIndex`);
      } else {
        if (!p.answers?.length) bad(`${p.id}: no answers`);
        for (const a of p.answers ?? []) if (!checkAnswer(a, a).ok) bad(`${p.id}: answer "${a}" does not accept itself`);
      }
    }
    console.log(`✓ ${where}: ${l.problems.length} problems`);
  }
}
if (errors) { console.error(`\n${errors} problem(s)`); process.exit(1); }
console.log("\nAll course data valid.");
