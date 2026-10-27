"use client";

import { useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

const BASE = [2, 4, 4, 4, 5, 5, 7, 9];
const MAX = 40, W = 400, H = 150, PAD = 20;
const sx = (v: number) => PAD + (v / MAX) * (W - 2 * PAD);

export function SpreadDemo() {
  const [extra, setExtra] = useState(20), [on, setOn] = useState(false);
  const data = on ? [...BASE, extra] : BASE;
  const sorted = [...data].sort((a, b) => a - b), n = sorted.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const sd = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const stack = new Map<number, number>();

  return (
    <div className="space-y-3" data-demo="spread">
      <Frame label="Dot plot of the data with the mean and median marked">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <line x1={PAD} x2={W - PAD} y1={H - 30} y2={H - 30} stroke="var(--muted)" />
          {[0, 10, 20, 30, 40].map((t) => <g key={t}><line x1={sx(t)} x2={sx(t)} y1={H - 30} y2={H - 25} stroke="var(--muted)" /><text x={sx(t)} y={H - 12} textAnchor="middle" fontSize={10} fill="var(--muted)">{t}</text></g>)}
          <line x1={sx(mean)} x2={sx(mean)} y1={14} y2={H - 30} stroke="var(--accent)" strokeWidth={2} />
          <line x1={sx(median)} x2={sx(median)} y1={14} y2={H - 30} stroke="var(--accent-2)" strokeWidth={2} strokeDasharray="5 3" />
          {data.map((v, i) => { const k = stack.get(v) ?? 0; stack.set(v, k + 1); const isExtra = on && i === data.length - 1;
            return <circle key={i} cx={sx(v)} cy={H - 38 - k * 12} r={5} fill={isExtra ? "var(--danger)" : "var(--fg)"} />; })}
          <text x={Math.min(sx(mean) + 4, W - 70)} y={11} fontSize={10} fill="var(--accent)">mean {+mean.toFixed(2)}</text>
          <text x={Math.max(sx(median) - 4, 70)} y={11} fontSize={10} fill="var(--accent-2)" textAnchor="end" dy={mean > median ? 0 : 0}>median {median}</text>
        </svg>
      </Frame>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="size-4 accent-[var(--accent)]" /> Add one extra value (the red dot)</label>
      <SliderRow label="extra value" min={0} max={MAX} value={extra} onChange={(v) => { setExtra(v); setOn(true); }} />
      <Readouts items={[["mean", +mean.toFixed(3)], ["median", median], ["std. deviation (population)", +sd.toFixed(3)], ["range", sorted[n - 1] - sorted[0]]]} />
      <p className="text-xs text-muted">Drag the extra value far out: the mean and spread chase it, while the median barely moves.</p>
    </div>
  );
}
