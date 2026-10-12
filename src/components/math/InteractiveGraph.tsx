"use client";

import { useId, useMemo, useRef } from "react";
import { cn } from "@/lib/cn";

export type Plot = { fn: (x: number) => number; color?: string; label?: string; dashed?: boolean };
export type GraphPoint = {
  x: number; y: number; color?: string; label?: string;
  /** If set, the point is draggable and reports the new coordinates */
  onDrag?: (x: number, y: number) => void;
};
export type Tracer = {
  /** Index into `plots` this point rides on */
  plot: number; x: number; onChange: (x: number) => void; showTangent?: boolean;
};

type Props = {
  plots: Plot[];
  points?: GraphPoint[];
  tracer?: Tracer;
  xRange?: [number, number];
  yRange?: [number, number];
  className?: string;
};

const W = 600, H = 400, PAD = 28;

function niceStep(span: number, target = 8) {
  const raw = span / target, pow = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / pow;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * pow;
}
const fmt = (n: number) => (Math.abs(n) < 1e-9 ? "0" : String(+n.toFixed(2)));

export function InteractiveGraph({ plots, points = [], tracer, xRange = [-10, 10], yRange = [-6, 6], className }: Props) {
  const clipId = useId();
  const svg = useRef<SVGSVGElement>(null);
  const [x0, x1] = xRange, [y0, y1] = yRange;
  const sx = (x: number) => PAD + ((x - x0) / (x1 - x0)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - y0) / (y1 - y0)) * (H - 2 * PAD);

  const toMath = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
    return {
      x: x0 + ((px - PAD) / (W - 2 * PAD)) * (x1 - x0),
      y: y0 + ((H - PAD - py) / (H - 2 * PAD)) * (y1 - y0),
    };
  };
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  const paths = useMemo(
    () =>
      plots.map(({ fn }) => {
        let d = "", pen = false, prev = NaN;
        const N = 500, jump = (y1 - y0) * 1.5;
        for (let i = 0; i <= N; i++) {
          const x = x0 + ((x1 - x0) * i) / N, y = fn(x);
          if (!Number.isFinite(y) || (pen && Math.abs(y - prev) > jump)) { pen = false; prev = NaN; if (!Number.isFinite(y)) continue; }
          d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${sy(clamp(y, y0 - 50 * (y1 - y0), y1 + 50 * (y1 - y0))).toFixed(1)}`;
          pen = true; prev = y;
        }
        return d;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plots, x0, x1, y0, y1],
  );

  const xs = niceStep(x1 - x0), ys = niceStep(y1 - y0);
  const xTicks = range(Math.ceil(x0 / xs) * xs, x1, xs), yTicks = range(Math.ceil(y0 / ys) * ys, y1, ys);
  const axisX = clamp(0, y0, y1), axisY = clamp(0, x0, x1);

  const tp = tracer ? { x: tracer.x, y: plots[tracer.plot].fn(tracer.x) } : null;
  let tangent: [number, number, number, number] | null = null;
  if (tracer?.showTangent && tp && Number.isFinite(tp.y)) {
    const h = 1e-4, m = (plots[tracer.plot].fn(tp.x + h) - plots[tracer.plot].fn(tp.x - h)) / (2 * h);
    if (Number.isFinite(m)) tangent = [x0, tp.y + m * (x0 - tp.x), x1, tp.y + m * (x1 - tp.x)];
  }

  const drag = (onMove: (e: React.PointerEvent) => void) => ({
    onPointerDown: (e: React.PointerEvent<SVGElement>) => e.currentTarget.setPointerCapture(e.pointerId),
    onPointerMove: (e: React.PointerEvent<SVGElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) onMove(e); },
  });

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Graph of ${plots.map((p) => p.label).filter(Boolean).join(", ") || "functions"}`}
      className={cn("w-full touch-none select-none rounded-xl border border-border bg-surface", className)}
    >
      <defs><clipPath id={clipId}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath></defs>
      <g stroke="var(--border)" strokeWidth={1}>
        {xTicks.map((t) => <line key={`gx${t}`} x1={sx(t)} x2={sx(t)} y1={PAD} y2={H - PAD} />)}
        {yTicks.map((t) => <line key={`gy${t}`} x1={PAD} x2={W - PAD} y1={sy(t)} y2={sy(t)} />)}
      </g>
      <g stroke="var(--muted)" strokeWidth={1.5}>
        <line x1={PAD} x2={W - PAD} y1={sy(axisX)} y2={sy(axisX)} />
        <line x1={sx(axisY)} x2={sx(axisY)} y1={PAD} y2={H - PAD} />
      </g>
      <g fill="var(--muted)" fontSize={10}>
        {xTicks.filter((t) => Math.abs(t) > 1e-9).map((t) => <text key={`tx${t}`} x={sx(t)} y={Math.min(sy(axisX) + 14, H - 6)} textAnchor="middle">{fmt(t)}</text>)}
        {yTicks.filter((t) => Math.abs(t) > 1e-9).map((t) => <text key={`ty${t}`} x={Math.max(sx(axisY) - 6, 18)} y={sy(t) + 3} textAnchor="end">{fmt(t)}</text>)}
      </g>
      <g clipPath={`url(#${clipId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={plots[i].color ?? "var(--accent)"} strokeWidth={2.5}
            strokeLinecap="round" strokeDasharray={plots[i].dashed ? "6 5" : undefined} />
        ))}
        {tangent && <line x1={sx(tangent[0])} y1={sy(tangent[1])} x2={sx(tangent[2])} y2={sy(tangent[3])} stroke="var(--accent-2)" strokeWidth={2} strokeDasharray="5 4" />}
      </g>
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r={p.onDrag ? 8 : 5} fill={p.color ?? "var(--accent-2)"} stroke="var(--bg)" strokeWidth={2}
            className={p.onDrag ? "cursor-grab active:cursor-grabbing" : undefined}
            {...(p.onDrag ? drag((e) => { const m = toMath(e); p.onDrag!(clamp(m.x, x0, x1), clamp(m.y, y0, y1)); }) : {})} />
          {p.label && <text x={sx(p.x) + 10} y={sy(p.y) - 10} fontSize={11} fill="var(--fg)">{p.label}</text>}
        </g>
      ))}
      {tracer && tp && Number.isFinite(tp.y) && (
        <circle cx={sx(tp.x)} cy={sy(clamp(tp.y, y0, y1))} r={8} fill="var(--accent-2)" stroke="var(--bg)" strokeWidth={2}
          className="cursor-grab active:cursor-grabbing" tabIndex={0} role="slider" aria-label="Move point along curve"
          aria-valuenow={+tp.x.toFixed(2)} aria-valuemin={x0} aria-valuemax={x1}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") tracer.onChange(clamp(tracer.x - 0.1, x0, x1)); if (e.key === "ArrowRight") tracer.onChange(clamp(tracer.x + 0.1, x0, x1)); }}
          {...drag((e) => tracer.onChange(clamp(toMath(e).x, x0, x1)))} />
      )}
    </svg>
  );
}

function range(a: number, b: number, step: number) {
  const out: number[] = [];
  for (let v = a; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}
