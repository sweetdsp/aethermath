"use client";

import { useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

// bump frequencies k, amplitudes and phases of a lumpy closed curve
const modes: [number, number, number][] = [[2, 0.14, 0.4], [3, 0.12, 1.9], [5, 0.1, 0.7], [8, 0.08, 2.6], [13, 0.06, 1.1]];

export function RicciDemo() {
  const [t, setT] = useState(0);
  const r = (th: number, time: number) => 1 + modes.reduce((s, [k, a, ph]) => s + a * Math.exp(-k * k * time) * Math.cos(k * th + ph), 0);
  const N = 360;
  const path = (time: number) => Array.from({ length: N + 1 }, (_, i) => { const th = (2 * Math.PI * i) / N, rr = r(th, time); return `${i ? "L" : "M"}${(rr * Math.cos(th)).toFixed(4)} ${(-rr * Math.sin(th)).toFixed(4)}`; }).join("") + "Z";
  const rs = Array.from({ length: N }, (_, i) => r((2 * Math.PI * i) / N, t));

  return (
    <div className="space-y-3" data-demo="ricci">
      <Frame label="A bumpy closed curve smoothing out over time">
        <svg viewBox="-1.5 -1.5 3 3" className="w-full">
          <path d={path(0)} fill="none" stroke="var(--muted)" strokeWidth={0.015} strokeDasharray="0.05 0.04" />
          <path d={path(t)} fill="color-mix(in oklab, var(--accent) 16%, transparent)" stroke="var(--accent)" strokeWidth={0.03} strokeLinejoin="round" />
        </svg>
      </Frame>
      <SliderRow label="flow time t" min={0} max={0.5} step={0.005} value={t} onChange={setT} />
      <Readouts items={[["bumpiness (max−min radius)", +(Math.max(...rs) - Math.min(...rs)).toFixed(3)], ["k=2 bump left", `${(100 * Math.exp(-4 * t)).toFixed(1)}%`], ["k=13 bump left", `${(100 * Math.exp(-169 * t)).toFixed(2)}%`]]} />
      <p className="text-xs leading-relaxed text-muted">A 1D heat-flow analogy, not real Ricci flow: bump number k fades like e<sup>−k²t</sup>, so sharp bumps vanish first. Real Ricci flow does this to the metric of a whole manifold.</p>
    </div>
  );
}
