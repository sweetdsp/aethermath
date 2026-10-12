"use client";

import { useState } from "react";
import { Readouts } from "./ui";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const presets: [number, number, string][] = [[1, 8, "1 + 8 = 9"], [3, 125, "3 + 125 = 128"], [1, 4374, "1 + 2·3⁷ = 5⁴·7"], [2, 6436341, "2 + 3¹⁰·109 = 23⁵"]];

export function AbcDemo() {
  const [a, setA] = useState(1), [b, setB] = useState(8);
  const ok = Number.isInteger(a) && Number.isInteger(b) && a >= 1 && b >= 1 && a <= 1e7 && b <= 1e7;
  const c = a + b, coprime = ok && gcd(a, b) === 1;
  const radabc = ok ? uniqueRad(a, b, c) : 1;
  const q = ok && radabc > 1 ? Math.log(c) / Math.log(radabc) : NaN;
  return (
    <div className="space-y-3" data-demo="abc">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input type="number" min={1} max={1e7} value={a} aria-label="a" onChange={(e) => setA(+e.target.value)} className="h-10 w-32 rounded-lg border border-border bg-bg px-3 font-mono" />
        <span>+</span>
        <input type="number" min={1} max={1e7} value={b} aria-label="b" onChange={(e) => setB(+e.target.value)} className="h-10 w-32 rounded-lg border border-border bg-bg px-3 font-mono" />
        <span>= <span className="font-mono">{ok ? c : "?"}</span></span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map(([x, y, l]) => <button key={l} onClick={() => { setA(x); setB(y); }} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-fg">{l}</button>)}
      </div>
      {!ok ? <p className="text-sm text-danger">Enter whole numbers between 1 and 10,000,000.</p> : !coprime ? <p className="text-sm text-danger">a and b share a factor ({gcd(a, b)}). The abc conjecture only concerns coprime triples.</p> : (
        <>
          <Readouts items={[["rad(abc)", radabc], ["c", c], ["quality q = ln c / ln rad(abc)", Number.isFinite(q) ? +q.toFixed(4) : "n/a"]]} />
          <p className="text-sm">{q > 1 ? <span className="font-medium text-accent">q &gt; 1: c is bigger than the radical of abc. These &ldquo;abc hits&rdquo; are rare, and the conjecture says q stays below 1+ε for all but finitely many triples.</span> : <span className="text-muted">q ≤ 1: the typical case. c is no larger than rad(abc).</span>}</p>
        </>
      )}
    </div>
  );
}

function uniqueRad(a: number, b: number, c: number) {
  const ps = new Set<number>();
  for (let n of [a, b, c]) { for (let p = 2; p * p <= n; p++) if (n % p === 0) { ps.add(p); while (n % p === 0) n /= p; } if (n > 1) ps.add(n); }
  return [...ps].reduce((x, y) => x * y, 1);
}
