"use client";

import { cn } from "@/lib/cn";

export function SliderRow({ label, min, max, step = 1, value, onChange }: { label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 text-muted">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(e) => onChange(+e.target.value)} className="min-w-0 flex-1 accent-[var(--accent)]" />
      <span className="w-12 text-right tabular-nums">{+value.toFixed(2)}</span>
    </label>
  );
}

export function Readouts({ items }: { items: [string, string | number][] }) {
  return (
    <dl className="flex flex-wrap gap-2 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-border bg-surface-2 px-3 py-1.5">
          <dt className="inline text-muted">{k} = </dt>
          <dd className="inline font-mono tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Segmented<T extends string | number>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={String(o.value)} role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}
          className={cn("rounded-lg border px-3 py-1 text-sm transition-colors", o.value === value ? "border-accent bg-accent/10 text-fg" : "border-border text-muted hover:text-fg")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const Frame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div role="img" aria-label={label} className="overflow-hidden rounded-xl border border-border bg-surface">{children}</div>
);
