"use client";

import type { DemoKind } from "@/lib/types";
import { AbcDemo } from "./AbcDemo";
import { FractalDemo } from "./FractalDemo";
import { GenusDemo } from "./GenusDemo";
import { PadicDemo } from "./PadicDemo";
import { RicciDemo } from "./RicciDemo";
import { RootsDemo } from "./RootsDemo";
import { SpectralDemo } from "./SpectralDemo";
import { TesseractDemo } from "./TesseractDemo";
import { SpreadDemo } from "./SpreadDemo";
import { LlnDemo } from "./LlnDemo";
import { RegressionDemo } from "./RegressionDemo";

const demos: Record<DemoKind, () => React.ReactElement> = {
  fractal: FractalDemo, tesseract: TesseractDemo, ricci: RicciDemo, genus: GenusDemo,
  padic: PadicDemo, roots: RootsDemo, abc: AbcDemo, spectral: SpectralDemo,
  spread: SpreadDemo, lln: LlnDemo, regression: RegressionDemo,
};

export function LessonDemo({ kind }: { kind: DemoKind }) {
  const Demo = demos[kind];
  return <Demo />;
}
