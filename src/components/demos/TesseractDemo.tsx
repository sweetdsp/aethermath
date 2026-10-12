"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Frame, Readouts, SliderRow } from "./ui";

const verts = Array.from({ length: 16 }, (_, i) => [0, 1, 2, 3].map((b) => ((i >> b) & 1 ? 1 : -1)));
const edges: [number, number, number][] = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) if (!((i >> b) & 1)) edges.push([i, i | (1 << b), b]);

function rot(v: number[], i: number, j: number, a: number) {
  const c = Math.cos(a), s = Math.sin(a), vi = v[i], vj = v[j];
  v[i] = c * vi - s * vj; v[j] = s * vi + c * vj;
}

export function TesseractDemo() {
  const [a, setA] = useState(0.6), [b, setB] = useState(0.4), [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      setA((x) => (x + dt * 0.6) % (2 * Math.PI)); setB((x) => (x + dt * 0.35) % (2 * Math.PI));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const pts = useMemo(() => verts.map((v0) => {
    const v = [...v0];
    rot(v, 0, 3, a); rot(v, 2, 3, b); rot(v, 0, 2, 0.5); rot(v, 1, 2, 0.35); // last two: fixed viewing tilt
    const k4 = 3 / (3 - v[3]); // 4D → 3D perspective
    const x = v[0] * k4, y = v[1] * k4, z = v[2] * k4;
    const k3 = 5 / (5 - z); // 3D → 2D perspective
    const r4 = (n: number) => Math.round(n * 1e4) / 1e4 + 0; // stable across server/browser trig
    return [r4(x * k3), r4(y * k3), r4(v[3])];
  }), [a, b]);

  return (
    <div className="space-y-3" data-demo="tesseract">
      <Frame label="Tesseract projected to 2D">
        <svg viewBox="-3.4 -3.4 6.8 6.8" className="w-full">
          {edges.map(([i, j, axis], k) => (
            <line key={k} x1={pts[i][0]} y1={-pts[i][1]} x2={pts[j][0]} y2={-pts[j][1]}
              stroke={axis === 3 ? "var(--accent-2)" : "var(--accent)"} strokeWidth={0.05} strokeLinecap="round" opacity={axis === 3 ? 0.8 : 1} />
          ))}
          {pts.map((p, k) => <circle key={k} cx={p[0]} cy={-p[1]} r={0.08} fill="var(--fg)" />)}
        </svg>
      </Frame>
      <div className="flex items-center gap-3">
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause rotation" : "Play rotation"}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-2">
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />} {playing ? "Pause" : "Rotate"}
        </button>
        <span className="text-xs text-muted">Cyan edges run along the 4th dimension.</span>
      </div>
      <SliderRow label="rotate x–w" min={0} max={6.28} step={0.01} value={a} onChange={setA} />
      <SliderRow label="rotate z–w" min={0} max={6.28} step={0.01} value={b} onChange={setB} />
      <Readouts items={[["vertices", 16], ["edges", 32], ["square faces", 24], ["cubic cells", 8]]} />
    </div>
  );
}
