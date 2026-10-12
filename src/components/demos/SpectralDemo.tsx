"use client";

import { useState } from "react";
import { Frame, Readouts, Segmented, SliderRow } from "./ui";

type Theory = "H" | "KU";
const coeff = (q: number, t: Theory) => (t === "H" ? q === 0 : q % 2 === 0); // E^q(pt) ≠ 0 ?
const QS = [4, 3, 2, 1, 0, -1, -2, -3, -4];

export function SpectralDemo() {
  const [n, setN] = useState(3), [t, setT] = useState<Theory>("KU");
  const cols = [0, 1, 2, 3, 4, 5, 6, 7];
  const nonzero = (p: number, q: number) => (p === 0 || p === n) && coeff(q, t);
  const count = (m: number) => cols.flatMap((p) => QS.map((q) => [p, q] as const)).filter(([p, q]) => p + q === m && nonzero(p, q)).length;

  const W = 36, x0 = 44, y0 = 8;
  return (
    <div className="space-y-3" data-demo="spectral">
      <Segmented label="Cohomology theory" value={t} onChange={setT} options={[{ value: "H", label: "Ordinary cohomology H" }, { value: "KU", label: "Complex K-theory KU" }]} />
      <Frame label={`E2 page for the sphere S^${n}`}>
        <svg viewBox={`0 0 ${x0 + cols.length * W + 8} ${y0 + QS.length * W + 30}`} className="w-full">
          {QS.map((q, r) => <text key={q} x={x0 - 10} y={y0 + r * W + W / 2 + 4} textAnchor="end" fontSize={11} fill="var(--muted)">q={q}</text>)}
          {cols.map((p) => <text key={p} x={x0 + p * W + W / 2} y={y0 + QS.length * W + 18} textAnchor="middle" fontSize={11} fill="var(--muted)">p={p}</text>)}
          {QS.flatMap((q, r) => cols.map((p) => {
            const on = nonzero(p, q), x = x0 + p * W, y = y0 + r * W;
            return (
              <g key={`${p}${q}`}>
                <rect x={x + 1} y={y + 1} width={W - 2} height={W - 2} rx={5} fill={on ? "color-mix(in oklab, var(--accent) 22%, transparent)" : "transparent"} stroke={on ? "var(--accent)" : "var(--border)"} />
                {on && <><text x={x + W / 2} y={y + W / 2 + 1} textAnchor="middle" fontSize={13} fill="var(--fg)">ℤ</text>
                  <text x={x + W / 2} y={y + W - 6} textAnchor="middle" fontSize={8} fill="var(--muted)">deg {p + q}</text></>}
              </g>
            );
          }))}
        </svg>
      </Frame>
      <SliderRow label="sphere dimension n" min={1} max={7} value={n} onChange={setN} />
      <Readouts items={[["ℤ's in total degree 0", count(0)], ["ℤ's in total degree 1", count(1)]]} />
      <p className="text-xs leading-relaxed text-muted">Boxes show E₂<sup>p,q</sup> = H<sup>p</sup>(Sⁿ; E<sup>q</sup>(pt)): nonzero only in columns p = 0 and p = n. Every differential would have to connect those two columns, but a sphere has a basepoint that splits off column 0, so they all vanish and the sequence collapses at E₂.</p>
    </div>
  );
}
