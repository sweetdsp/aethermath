"use client";

import { useEffect, useMemo, useState } from "react";
import { Frame, Readouts, Segmented, SliderRow } from "./ui";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export function RootsDemo() {
  const [n, setN] = useState(12), [a, setA] = useState(5);
  const units = useMemo(() => Array.from({ length: n }, (_, i) => i).filter((k) => gcd(k, n) === 1), [n]);
  useEffect(() => { if (!units.includes(a)) setA(units[units.length > 1 ? 1 : 0]); }, [units, a]);
  // rounded so server- and browser-computed trig give identical attributes (avoids hydration mismatches)
  const r4 = (v: number) => Math.round(v * 1e4) / 1e4 + 0;
  const pos = (k: number): [number, number] => [r4(Math.cos((2 * Math.PI * k) / n)), r4(-Math.sin((2 * Math.PI * k) / n))];
  const [x1, y1] = pos(1), [xa, ya] = pos(a);

  return (
    <div className="space-y-3" data-demo="roots">
      <Frame label={`The ${n}th roots of unity`}>
        <svg viewBox="-1.3 -1.3 2.6 2.6" className="mx-auto max-h-72 w-full">
          <circle r={1} fill="none" stroke="var(--border)" strokeWidth={0.02} />
          <line x1={x1} y1={y1} x2={xa} y2={ya} stroke="var(--accent-2)" strokeWidth={0.025} strokeDasharray="0.06 0.04" />
          {Array.from({ length: n }, (_, k) => { const [x, y] = pos(k); const prim = gcd(k, n) === 1; return (
            <g key={k}><circle cx={x} cy={y} r={prim ? 0.06 : 0.04} fill={k === a ? "var(--accent-2)" : k === 1 ? "var(--accent)" : prim ? "var(--fg)" : "var(--muted)"} />
              {k <= 1 || k === a ? <text x={x * 1.16} y={y * 1.16 + 0.04} fontSize={0.11} textAnchor="middle" fill="var(--fg)">{k === 0 ? "1" : `ζ${k === 1 ? "" : `^${k}`}`}</text> : null}</g>); })}
        </svg>
      </Frame>
      <SliderRow label="n (roots of unity)" min={3} max={24} value={n} onChange={setN} />
      <div><p className="mb-1.5 text-sm text-muted">Choose a unit a mod n (a Galois element σₐ):</p>
        <Segmented label="Unit a" value={a} onChange={setA} options={units.map((u) => ({ value: u, label: String(u) }))} /></div>
      <Readouts items={[["φ(n) = |Gal(ℚ(ζₙ)/ℚ)|", units.length], [`σ_${a}`, `ζ ↦ ζ^${a}`], [`ζ^3 ↦`, `ζ^${(3 * a) % n}`]]} />
      <p className="text-xs text-muted">White points are primitive roots: Galois shuffles exactly those among themselves, and every σₐ is determined by the exponent a.</p>
    </div>
  );
}
