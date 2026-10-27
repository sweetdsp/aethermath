"use client";

import { useMemo, useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

const W = 400, H = 220, PX = 34, PY = 14, MAXN = 5000;

export function LlnDemo() {
  const [p, setP] = useState(0.5);
  const [flips, setFlips] = useState<number[]>([]); // empty on first render, so server and browser agree
  const n = flips.length, heads = flips.reduce((a, b) => a + b, 0);

  const add = (k: number) => setFlips((f) => { const room = Math.min(k, MAXN - f.length); return [...f, ...Array.from({ length: room }, () => (Math.random() < p ? 1 : 0))]; });
  const reset = () => setFlips([]);

  const path = useMemo(() => {
    if (!flips.length) return "";
    const top = Math.max(10, flips.length), pts: string[] = [];
    let h = 0, lastX = -1;
    flips.forEach((v, i) => {
      h += v; const k = i + 1, x = PX + (Math.log10(k) / Math.log10(top)) * (W - PX - 10);
      if (x - lastX >= 1 || k === flips.length) { pts.push(`${pts.length ? "L" : "M"}${x.toFixed(1)} ${(H - PY - (h / k) * (H - 2 * PY)).toFixed(1)}`); lastX = x; }
    });
    return pts.join("");
  }, [flips]);

  const top = Math.max(10, n), yy = (v: number) => H - PY - v * (H - 2 * PY);
  const ticks = [1, 10, 100, 1000].filter((t) => t <= top);

  return (
    <div className="space-y-3" data-demo="lln">
      <Frame label="Running proportion of heads as the number of flips grows">
        <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((v) => <g key={v}><line x1={PX} x2={W - 10} y1={yy(v)} y2={yy(v)} stroke="var(--border)" /><text x={PX - 5} y={yy(v) + 3} textAnchor="end" fontSize={9} fill="var(--muted)">{v}</text></g>)}
          <line x1={PX} x2={W - 10} y1={yy(p)} y2={yy(p)} stroke="var(--accent-2)" strokeDasharray="5 3" strokeWidth={1.5} />
          {ticks.map((t) => { const x = PX + (Math.log10(t) / Math.log10(top)) * (W - PX - 10); return <text key={t} x={x} y={H + 10} textAnchor="middle" fontSize={9} fill="var(--muted)">{t}</text>; })}
          {path && <path d={path} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinejoin="round" />}
          {!n && <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={12} fill="var(--muted)">Flip the coin to start</text>}
        </svg>
      </Frame>
      <SliderRow label="P(heads)" min={0.05} max={0.95} step={0.05} value={p} onChange={(v) => { setP(v); reset(); }} />
      <div className="flex flex-wrap gap-1.5">
        {[1, 10, 100, 1000].map((k) => <button key={k} onClick={() => add(k)} className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-surface-2">+{k} flip{k > 1 ? "s" : ""}</button>)}
        <button onClick={reset} className="rounded-lg px-3 py-1 text-sm text-muted hover:text-fg">Reset</button>
      </div>
      <Readouts items={[["flips", n], ["heads", heads], ["proportion", n ? +(heads / n).toFixed(4) : "n/a"], ["true P(heads)", p]]} />
      <p className="text-xs text-muted">The x-axis is logarithmic. Early on the proportion swings wildly; with more flips it settles onto the dashed line.</p>
    </div>
  );
}
