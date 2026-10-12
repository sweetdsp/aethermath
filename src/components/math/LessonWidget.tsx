"use client";

import { useMemo, useState } from "react";
import type { Widget } from "@/lib/types";
import { compile, type Compiled } from "@/lib/expr";
import { InteractiveGraph, type GraphLine, type GraphPoint } from "./InteractiveGraph";
import { MathRenderer } from "./MathRenderer";

const num = (n: number) => (Number.isFinite(n) ? String(+n.toFixed(2)) : "\\text{undefined}");
const plain = (n: number) => (Number.isFinite(n) ? String(+n.toFixed(3)) : "undefined");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Fills [[expr]] slots in an equation template. */
function fillTemplate(tpl: string, vals: Record<string, number>, cache: Map<string, Compiled>, names: string[]) {
  return tpl.replace(/\[\[([+*=]?)([^\]]+)\]\]/g, (_, mode: string, src: string) => {
    let c = cache.get(src);
    if (!c) { c = compile(src, names); cache.set(src, c); }
    const v = c.fn(vals);
    if (mode === "+") return Number.isFinite(v) ? `${v < 0 ? "-" : "+"} ${num(Math.abs(v))}` : num(v);
    if (mode === "*") return v === 1 ? "" : v === -1 ? "-" : num(v);
    return num(v);
  });
}

export function LessonWidget({ widget }: { widget: Widget }) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(widget.sliders.map((s) => [s.key, s.initial])));
  const names = useMemo(() => widget.sliders.map((s) => s.key), [widget]);
  const cache = useMemo(() => new Map<string, Compiled>(), []);
  const ev = (src: string, v = vals) => {
    let c = cache.get(src);
    if (!c) { c = compile(src, names); cache.set(src, c); }
    return c.fn(v);
  };

  const set = (key: string, value: number) => {
    const s = widget.sliders.find((s) => s.key === key);
    if (!s) return;
    const snapped = Math.round(value / s.step) * s.step;
    setVals((p) => ({ ...p, [key]: +clamp(snapped, s.min, s.max).toFixed(6) }));
  };

  // Rebuild plot functions only when slider values change
  const plots = widget.plots.map((p) => ({ ...p, fn: (x: number) => ev(p.expr, { ...vals, x }) }));

  const points: GraphPoint[] = (widget.points ?? [])
    .map((p) => {
      const x = ev(p.x), y = ev(p.y);
      const d = p.drag;
      return {
        x, y, label: p.label,
        onDrag: d ? (nx: number, ny: number) => { if (d.x) set(d.x, nx); if (d.y) set(d.y, ny); } : undefined,
      };
    })
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

  const lines: GraphLine[] = [];
  if (widget.secant) {
    const { plot, x, h } = widget.secant, f = plots[plot].fn, x0 = vals[x], x1 = x0 + vals[h];
    lines.push({ x1: x0, y1: f(x0), x2: x1, y2: f(x1) });
  }

  const slope = (r: NonNullable<Widget["readouts"]>[number]) => {
    if (r.derivativeOf) {
      const f = plots[r.derivativeOf.plot].fn, x = vals[r.derivativeOf.at], h = 1e-4;
      return (f(x + h) - f(x - h)) / (2 * h);
    }
    return ev(r.expr ?? "NaN");
  };

  return (
    <div className="space-y-3">
      <MathRenderer tex={fillTemplate(widget.equation, vals, cache, names)} display className="text-xl" />
      <InteractiveGraph
        plots={plots} points={points} lines={lines} xRange={widget.xRange} yRange={widget.yRange}
        tracer={widget.tracer && { plot: widget.tracer.plot, x: vals[widget.tracer.param], showTangent: widget.tracer.tangent, onChange: (x) => set(widget.tracer!.param, x) }}
      />
      <div className="grid gap-2">
        {widget.sliders.map((s) => (
          <label key={s.key} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-muted">{s.label}</span>
            <input type="range" min={s.min} max={s.max} step={s.step} value={vals[s.key]} onChange={(e) => set(s.key, +e.target.value)}
              className="min-w-0 flex-1 accent-[var(--accent)]" aria-label={s.label} />
            <span className="w-12 text-right tabular-nums">{vals[s.key]}</span>
          </label>
        ))}
      </div>
      {widget.readouts && (
        <dl className="flex flex-wrap gap-2 text-sm">
          {widget.readouts.map((r) => (
            <div key={r.label} className="rounded-lg border border-border bg-surface-2 px-3 py-1.5">
              <dt className="inline text-muted">{r.label} = </dt>
              <dd className="inline font-mono tabular-nums">{plain(slope(r))}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
