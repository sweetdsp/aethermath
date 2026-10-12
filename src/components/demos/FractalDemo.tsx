"use client";

import { useMemo, useState } from "react";
import { Frame, Readouts, Segmented, SliderRow } from "./ui";

type P = [number, number];

function koch(n: number): P[] {
  let pts: P[] = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2], [0, 0]];
  const c = Math.cos(-Math.PI / 3), s = Math.sin(-Math.PI / 3);
  for (let i = 0; i < n; i++) {
    const out: P[] = [];
    for (let j = 0; j < pts.length - 1; j++) {
      const [px, py] = pts[j], [qx, qy] = pts[j + 1];
      const dx = (qx - px) / 3, dy = (qy - py) / 3;
      const a: P = [px + dx, py + dy], b: P = [px + 2 * dx, py + 2 * dy];
      const peak: P = [a[0] + dx * c - dy * s, a[1] + dx * s + dy * c];
      out.push([px, py], a, peak, b);
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

function sierpinski(n: number): string {
  let d = "";
  const rec = (a: P, b: P, c: P, k: number) => {
    if (k === 0) { d += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}Z`; return; }
    const ab: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], bc: P = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], ca: P = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
    rec(a, ab, ca, k - 1); rec(ab, b, bc, k - 1); rec(ca, bc, c, k - 1);
  };
  rec([0, 0], [1, 0], [0.5, Math.sqrt(3) / 2], n);
  return d;
}

export function FractalDemo() {
  const [kind, setKind] = useState<"koch" | "sier">("koch");
  const [n, setN] = useState(3);
  const level = kind === "koch" ? Math.min(n, 5) : n;

  const kochPath = useMemo(() => (kind === "koch" ? koch(level).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(4)} ${(-y).toFixed(4)}`).join("") : ""), [kind, level]);
  const sierPath = useMemo(() => (kind === "sier" ? sierpinski(level).replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${x} ${-y}`) : ""), [kind, level]);

  return (
    <div className="space-y-3" data-demo="fractal">
      <Segmented label="Fractal" value={kind} onChange={(k) => { setKind(k); if (k === "koch") setN((v) => Math.min(v, 5)); }}
        options={[{ value: "koch", label: "Koch snowflake" }, { value: "sier", label: "Sierpiński triangle" }]} />
      <Frame label={`${kind === "koch" ? "Koch snowflake" : "Sierpiński triangle"} after ${level} steps`}>
        <svg viewBox="-0.08 -1 1.16 1.08" className="w-full">
          {kind === "koch"
            ? <path d={kochPath} fill="color-mix(in oklab, var(--accent) 18%, transparent)" stroke="var(--accent)" strokeWidth={0.004} strokeLinejoin="round" />
            : <path d={sierPath} fill="var(--accent)" stroke="var(--accent)" strokeWidth={0.001} />}
        </svg>
      </Frame>
      <SliderRow label="steps n" min={0} max={kind === "koch" ? 5 : 7} value={level} onChange={setN} />
      {kind === "koch" ? (
        <Readouts items={[["segments", 3 * 4 ** level], ["perimeter (side=1)", +(3 * (4 / 3) ** level).toFixed(3)], ["dimension ln4/ln3", +(Math.log(4) / Math.log(3)).toFixed(4)]]} />
      ) : (
        <Readouts items={[["triangles", 3 ** level], ["area left", +((3 / 4) ** level).toFixed(4)], ["dimension ln3/ln2", +(Math.log(3) / Math.log(2)).toFixed(4)]]} />
      )}
    </div>
  );
}
