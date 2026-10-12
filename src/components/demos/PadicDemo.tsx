"use client";

import { useState } from "react";
import { Readouts, Segmented, SliderRow } from "./ui";

const val = (n: number, p: number) => { let v = 0; while (n % p === 0) { n /= p; v++; } return v; };
const digits = (n: number, p: number) => { const d: number[] = []; while (n > 0) { d.push(n % p); n = Math.floor(n / p); } return d.length ? d : [0]; };

export function PadicDemo() {
  const [p, setP] = useState(2), [n, setN] = useState(48), [m, setM] = useState(80);
  const vn = val(n, p), diff = Math.abs(n - m), vd = diff === 0 ? Infinity : val(diff, p);
  return (
    <div className="space-y-3" data-demo="padic">
      <Segmented label="Prime p" value={p} onChange={setP} options={[2, 3, 5, 7].map((x) => ({ value: x, label: `p = ${x}` }))} />
      <SliderRow label="number n" min={1} max={500} value={n} onChange={setN} />
      <SliderRow label="number m" min={1} max={500} value={m} onChange={setM} />
      <Readouts items={[[`v_${p}(n)`, vn], [`|n|_${p}`, vn === 0 ? "1" : `1/${p ** vn}`]]} />
      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <p className="text-muted">n written in base {p}, with the <em>lowest</em> digit first (the p-adic way):</p>
        <p className="mt-1 font-mono text-base tracking-widest">…{[...digits(n, p)].map((d, i) => <span key={i} className={i < vn ? "text-accent-2" : ""}>{d}</span>)}</p>
        <p className="mt-3">Distance |n − m|<sub>{p}</sub> = <span className="font-mono">{vd === Infinity ? "0" : vd === 0 ? "1" : `1/${p ** vd}`}</span>
          <span className="text-muted"> ({vd === Infinity ? "same number" : `n−m = ${n - m} is divisible by ${p}^${vd}`})</span></p>
        <p className="mt-1 text-xs text-muted">Highly divisible by p means p-adically tiny. Numbers are close when their difference is.</p>
      </div>
    </div>
  );
}
