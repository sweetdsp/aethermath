import katex from "katex";
import { cn } from "@/lib/cn";

function render(tex: string, display: boolean) {
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "html", strict: "ignore" });
}

/** Renders a single LaTeX expression. */
export function MathRenderer({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  return (
    <span
      className={cn(display && "block overflow-x-auto py-2 text-center", className)}
      dangerouslySetInnerHTML={{ __html: render(tex, display) }}
    />
  );
}

/** Text with inline math: "Find $x$ if $2x+1=7$". Use $$...$$ for display math. */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).filter(Boolean);
  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {parts.map((p, i) =>
        p.startsWith("$$") ? <MathRenderer key={i} tex={p.slice(2, -2)} display /> :
        p.startsWith("$") ? <MathRenderer key={i} tex={p.slice(1, -1)} /> :
        <span key={i}>{p}</span>,
      )}
    </span>
  );
}
