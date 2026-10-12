"use client";

import { useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

export function GenusDemo() {
  const [g, setG] = useState(1);
  const w = 120 + g * 110, h = 140, rx = 70, cy = h / 2;
  const holes = Array.from({ length: g }, (_, i) => 60 + 110 * (i + 0.5) + (i === 0 ? 0 : 0));
  const body = `M${rx} 0H${w - rx}A${rx} ${cy} 0 0 1 ${w - rx} ${h}H${rx}A${rx} ${cy} 0 0 1 ${rx} 0Z`;
  const hole = (x: number) => `M${x - 36} ${cy}a36 20 0 1 0 72 0a36 20 0 1 0 -72 0Z`;
  const betti = [1, 2 * g, 1];
  return (
    <div className="space-y-3" data-demo="genus">
      <Frame label={`Surface of genus ${g}`}>
        <svg viewBox={`-10 -10 ${w + 20} ${h + 20}`} className="mx-auto max-h-64 w-full">
          <path d={body + holes.map(hole).join("")} fillRule="evenodd" fill="color-mix(in oklab, var(--accent) 30%, transparent)" stroke="var(--accent)" strokeWidth={3} />
        </svg>
      </Frame>
      <SliderRow label="holes (genus g)" min={0} max={4} value={g} onChange={setG} />
      <Readouts items={[["b₀", betti[0]], ["b₁ = 2g", betti[1]], ["b₂", betti[2]], ["χ = b₀−b₁+b₂", betti[0] - betti[1] + betti[2]]]} />
      <p className="text-xs text-muted">{g === 0 ? "g=0: the Riemann sphere (the projective line over ℂ)." : g === 1 ? "g=1: a torus, which is what an elliptic curve over ℂ looks like." : `A smooth complex algebraic curve of genus ${g}.`}</p>
    </div>
  );
}
