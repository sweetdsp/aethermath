"use client";

import { useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const noise = [1.2, -0.8, 0.5, -1.5, 1.0, 0.3, -0.9, 1.4, -0.4, 0.6];
const ys = xs.map((x, i) => 2 * x + 1 + noise[i]);
const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0), syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
const bestM = sxy / sxx, bestB = my - bestM * mx, r = sxy / Math.sqrt(sxx * syy);
const sse = (m: number, b: number) => xs.reduce((a, x, i) => a + (ys[i] - (m * x + b)) ** 2, 0);

const W = 400, H = 260, PX = 30, PY = 14, XMAX = 11, YMAX = 26;
const sx = (x: number) => PX + (x / XMAX) * (W - PX - 10), sy = (y: number) => H - PY - (y / YMAX) * (H - 2 * PY);

export function RegressionDemo() {
  const [m, setM] = useState(1), [b, setB] = useState(0), [show, setShow] = useState(false);
  const line = (mm: number, bb: number, color: string, dash?: string) => <line x1={sx(0)} y1={sy(bb)} x2={sx(XMAX)} y2={sy(mm * XMAX + bb)} stroke={color} strokeWidth={2} strokeDasharray={dash} />;
  return (
    <div className="space-y-3" data-demo="regression">
      <Frame label="Scatter plot with your line and the least-squares line">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs><clipPath id="regclip"><rect x={PX} y={PY} width={W - PX - 10} height={H - 2 * PY} /></clipPath></defs>
          {[0, 5, 10, 15, 20, 25].map((v) => <g key={v}><line x1={PX} x2={W - 10} y1={sy(v)} y2={sy(v)} stroke="var(--border)" /><text x={PX - 5} y={sy(v) + 3} textAnchor="end" fontSize={9} fill="var(--muted)">{v}</text></g>)}
          <g clipPath="url(#regclip)">
            {xs.map((x, i) => <line key={`r${i}`} x1={sx(x)} x2={sx(x)} y1={sy(ys[i])} y2={sy(m * x + b)} stroke="var(--danger)" strokeWidth={1.5} opacity={0.7} />)}
            {line(m, b, "var(--accent)")}
            {show && line(bestM, bestB, "var(--accent-2)", "6 4")}
          </g>
          {xs.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={4.5} fill="var(--fg)" />)}
        </svg>
      </Frame>
      <SliderRow label="slope m" min={-1} max={4} step={0.1} value={m} onChange={setM} />
      <SliderRow label="intercept b" min={-5} max={10} step={0.1} value={b} onChange={setB} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="size-4 accent-[var(--accent)]" /> Show the least-squares line</label>
      <Readouts items={[["your SSE", +sse(m, b).toFixed(2)], ["best possible SSE", +sse(bestM, bestB).toFixed(2)], ["correlation r", +r.toFixed(3)], ["best fit", `y = ${bestM.toFixed(2)}x + ${bestB.toFixed(2)}`]]} />
      <p className="text-xs text-muted">Red segments are the residuals. Adjust your line to shrink the sum of their squares (SSE); the least-squares line makes it as small as any line can.</p>
    </div>
  );
}
