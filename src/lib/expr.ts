/**
 * Tiny expression engine: parse → compile → numeric equivalence checking.
 * Self-contained (no imports) so it can be unit-tested with plain Node.
 */

export class ParseError extends Error {}

type Tok = { t: "num" | "id" | "fn" | "op"; v: string };
type Vars = Record<string, number>;
type Node = (v: Vars) => number;

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: Math.sqrt, abs: Math.abs, ln: Math.log, log: Math.log10, exp: Math.exp,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };
const FUNC_NAMES = Object.keys(FUNCS).sort((a, b) => b.length - a.length);

function tokenize(src: string): Tok[] {
  const s = src
    .replace(/[−–]/g, "-").replace(/[×·]/g, "*").replace(/÷/g, "/")
    .replace(/²/g, "^2").replace(/³/g, "^3").replace(/π/g, "pi").replace(/\s+/g, "");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) throw new ParseError(`Unexpected "${c}"`);
      out.push({ t: "num", v: m[0] });
      i += m[0].length;
    } else if (/[A-Za-z]/.test(c)) {
      const rest = s.slice(i);
      const fn = FUNC_NAMES.find((n) => rest.startsWith(n + "("));
      if (fn) { out.push({ t: "fn", v: fn }); i += fn.length; }
      else if (rest.startsWith("pi")) { out.push({ t: "id", v: "pi" }); i += 2; }
      else { out.push({ t: "id", v: c }); i += 1; }
    } else if ("+-*/^(),".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
    } else throw new ParseError(`Unexpected "${c}"`);
  }
  return out;
}

export type Compiled = { fn: Node; vars: string[] };

export function compile(src: string): Compiled {
  const toks = tokenize(src);
  if (!toks.length) throw new ParseError("Empty expression");
  const vars = new Set<string>();
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek().v === v;

  const expr = (): Node => {
    let l = term();
    while (isOp("+") || isOp("-")) {
      const plus = toks[p++].v === "+";
      const a = l, b = term();
      l = plus ? (v) => a(v) + b(v) : (v) => a(v) - b(v);
    }
    return l;
  };
  const startsFactor = () => {
    const k = peek();
    return !!k && (k.t === "num" || k.t === "id" || k.t === "fn" || (k.t === "op" && k.v === "("));
  };
  const term = (): Node => {
    let l = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const mul = toks[p++].v === "*";
        const a = l, b = unary();
        l = mul ? (v) => a(v) * b(v) : (v) => a(v) / b(v);
      } else if (startsFactor()) {
        const a = l, b = unary(); // implicit multiplication: 2x, x(x+1), (a)(b)
        l = (v) => a(v) * b(v);
      } else return l;
    }
  };
  const unary = (): Node => {
    if (isOp("-")) { p++; const a = unary(); return (v) => -a(v); }
    if (isOp("+")) { p++; return unary(); }
    return power();
  };
  const power = (): Node => {
    const base = atom();
    if (isOp("^")) { p++; const e = unary(); return (v) => Math.pow(base(v), e(v)); }
    return base;
  };
  const atom = (): Node => {
    const k = toks[p++];
    if (!k) throw new ParseError("Expression ended unexpectedly");
    if (k.t === "num") { const n = parseFloat(k.v); return () => n; }
    if (k.t === "id") {
      if (k.v in CONSTS) { const n = CONSTS[k.v]; return () => n; }
      vars.add(k.v);
      return (v) => (k.v in v ? v[k.v] : NaN);
    }
    if (k.t === "fn") {
      p++; // "("
      const a = expr();
      if (!isOp(")")) throw new ParseError("Missing )");
      p++;
      const f = FUNCS[k.v];
      return (v) => f(a(v));
    }
    if (k.v === "(") {
      const a = expr();
      if (!isOp(")")) throw new ParseError("Missing )");
      p++;
      return a;
    }
    throw new ParseError(`Unexpected "${k.v}"`);
  };

  const root = expr();
  if (p < toks.length) throw new ParseError(`Unexpected "${toks[p].v}"`);
  return { fn: root, vars: [...vars] };
}

/** Compile a one-variable expression into f(x); returns NaN on bad input. */
export function toFunction(src: string, variable = "x"): (x: number) => number {
  try {
    const { fn } = compile(src);
    return (x) => fn({ [variable]: x });
  } catch {
    return () => NaN;
  }
}

// ---------------------------------------------------------------- equivalence

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Parsed = { kind: "expr"; f: Compiled } | { kind: "eq"; f: Compiled; lhs: Compiled; rhs: Compiled; lhsVar: string | null };

function parse(src: string): Parsed {
  const parts = src.split("=");
  if (parts.length > 2) throw new ParseError("Only one = allowed");
  if (parts.length === 1) return { kind: "expr", f: compile(parts[0]) };
  const lhs = compile(parts[0]), rhs = compile(parts[1]);
  const vars = [...new Set([...lhs.vars, ...rhs.vars])];
  const lhsVar = /^[A-Za-z]$/.test(parts[0].trim()) ? parts[0].trim() : null;
  return { kind: "eq", lhs, rhs, lhsVar, f: { fn: (v) => lhs.fn(v) - rhs.fn(v), vars } };
}

export type CheckResult =
  | { ok: true }
  | { ok: false; reason: "parse"; message: string }
  | { ok: false; reason: "mismatch" };

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-6 * (1 + Math.max(Math.abs(a), Math.abs(b)));

function samplePoints(vars: string[], n = 40) {
  const rnd = mulberry32(1234567);
  return Array.from({ length: n }, () =>
    Object.fromEntries(vars.map((v) => [v, rnd() * 10 - 5 + 0.0137])),
  );
}

function sameValues(a: Node, b: Node, vars: string[], mode: "equal" | "proportional") {
  let valid = 0, k: number | null = null;
  for (const pt of samplePoints(vars)) {
    const x = a(pt), y = b(pt);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    valid++;
    if (mode === "equal") { if (!close(x, y)) return false; continue; }
    if (k === null) {
      if (Math.abs(y) < 1e-6) { if (Math.abs(x) > 1e-6) return false; continue; }
      k = x / y;
      if (Math.abs(k) < 1e-9) return false;
    } else if (!close(x, k * y)) return false;
  }
  return valid >= 8 && (mode === "equal" || k !== null);
}

function matches(user: Parsed, exp: Parsed): boolean {
  const vars = [...new Set([...user.f.vars, ...exp.f.vars])];
  if (user.kind === "expr" && exp.kind === "expr") return sameValues(user.f.fn, exp.f.fn, vars, "equal");
  if (user.kind === "eq" && exp.kind === "eq") return sameValues(user.f.fn, exp.f.fn, vars, "proportional");
  // "x = 5" expected, "5" typed (or vice versa): compare the solved side
  const [eq, ex] = user.kind === "eq" ? [user, exp] : [exp as Extract<Parsed, { kind: "eq" }>, user];
  if (eq.kind !== "eq" || !eq.lhsVar || ex.kind !== "expr") return false;
  return sameValues(eq.rhs.fn, ex.f.fn, vars, "equal");
}

/** Is `input` algebraically equivalent to any accepted answer? */
export function checkAnswer(input: string, accepted: string | string[]): CheckResult {
  let user: Parsed;
  try { user = parse(input); }
  catch (e) { return { ok: false, reason: "parse", message: e instanceof ParseError ? e.message : "Couldn't read that" }; }
  for (const a of Array.isArray(accepted) ? accepted : [accepted]) {
    try { if (matches(user, parse(a))) return { ok: true }; } catch { /* bad key: skip */ }
  }
  return { ok: false, reason: "mismatch" };
}
