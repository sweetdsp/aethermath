import type { Course } from "@/lib/types";
import { ex, mc } from "./helpers";

const r = String.raw;

export const geometry: Course = {
  topic: "geometry",
  title: "Shapes Beyond the Plane",
  lessons: [
    {
      slug: "fractals",
      title: "Fractals",
      summary: "Patterns that repeat at every scale, and why their dimension can be a fraction.",
      minutes: 10,
      concept: [
        { type: "p", text: r`A fractal is a shape that contains smaller copies of itself: zoom in and you keep finding the same structure. Nature uses this trick everywhere: coastlines, clouds, ferns, river networks, lungs.` },
        { type: "math", tex: r`D = \dfrac{\ln N}{\ln s}` },
        { type: "callout", title: "Dimension can be a fraction", text: r`If a shape is made of $N$ copies of itself, each scaled down by a factor $s$, its similarity dimension is $D=\ln N/\ln s$. The Koch curve has $N=4$, $s=3$, so $D\approx1.26$: more than a line ($1$), less than a plane ($2$).` },
        { type: "callout", title: "The coastline paradox", text: r`The measured length of a coastline grows as your ruler shrinks, because ever-smaller wiggles keep appearing. Real coastlines are only approximately fractal, but their measured dimension is around $1.2$ to $1.3$.` },
        { type: "p", text: r`Step through the iterations below and watch the counts grow.` },
      ],
      demo: "fractal",
      problems: [
        ex("geo1-1", r`A Koch curve starts as a straight segment of length $1$. Each step replaces every segment by $4$ segments, each $\tfrac13$ as long. What is the total length after $3$ steps? (enter a fraction)`, ["64/27"],
          [r`Each step multiplies the total length by $\tfrac43$.`, r`Compute $(\tfrac43)^3$.`],
          ["By what factor does the length change in one step?", "How many times do you apply it?"], r`$(\tfrac43)^3=\tfrac{64}{27}\approx2.37$.`),
        ex("geo1-2", r`The Sierpiński carpet is made of $8$ copies of itself, each scaled by $\tfrac13$. Find its dimension. Type it with $\ln$, e.g. ln(8)/ln(3)`, ["ln(8)/ln(3)"],
          [r`Use $D=\ln N/\ln s$.`, r`Here $N=8$ and $s=3$.`],
          ["What are N and s?", "Which one goes on top of the fraction?"], r`$D=\ln8/\ln3\approx1.893$.`, 15),
        mc("geo1-3", "A Sierpiński triangle removes the middle triangle at every step. How many small triangles remain after $n$ steps?", [r`$2^n$`, r`$3^n$`, r`$4^n$`, r`$3n$`], 1,
          ["Count: 1, 3, 9, ... Each triangle becomes three."], ["How many triangles does each triangle turn into?", "What pattern gives 1, 3, 9, 27?"], r`Each step triples the count: $3^n$.`),
        mc("geo1-4", "What happens to the Koch curve's length as the number of steps grows without bound?", ["It converges to 3", "It grows without bound", "It shrinks to 0", "It equals its area"], 1,
          [r`The length is multiplied by $\tfrac43>1$ each step.`], ["What happens if you keep multiplying by 4/3?", "Is the curve getting longer or shorter each time?"], r`$(\tfrac43)^n\to\infty$: an infinitely long curve enclosing a finite area.`),
      ],
    },
    {
      slug: "tesseract",
      title: "The Tesseract",
      summary: "The four-dimensional cube, and how to see its shadow.",
      minutes: 9,
      concept: [
        { type: "p", text: r`A square has $4$ corners and a cube has $8$. Keep adding dimensions and you get the hypercube. In four dimensions it is called the tesseract.` },
        { type: "math", tex: r`\text{vertices}=2^n,\qquad \text{edges}=n\cdot2^{n-1}` },
        { type: "callout", title: "Building one", text: r`Slide a cube a unit distance in a fourth direction. The start and end cubes, plus one cube swept out by each of the cube's $6$ faces, give $8$ cubic cells in total, joined along $24$ square faces.` },
        { type: "callout", title: "How do we look at 4D?", text: r`We cannot see it directly, but we can rotate it in 4D and look at its shadow, just as a rotating cube casts a shadow that changes between a square and a hexagon. Press Rotate below.` },
      ],
      demo: "tesseract",
      problems: [
        ex("geo2-1", r`How many vertices does a tesseract have? Use $2^n$ with $n=4$.`, ["16"], [r`Compute $2^4$.`], ["How many corners does a square (n=2) have?", "What is 2 to the power 4?"], r`$2^4=16$.`, 5),
        ex("geo2-2", r`How many edges? Use $n\cdot2^{n-1}$ with $n=4$.`, ["32"], [r`$4\cdot2^3$.`], ["What is 2³?", "Multiply by 4."], r`$4\cdot8=32$.`, 5),
        mc("geo2-3", "How many cubic cells make up the boundary of a tesseract?", ["4", "6", "8", "16"], 2,
          ["A cube's boundary has 6 square faces. What is the 4D analogue?"], ["How many squares bound a cube?", "How many cubes bound a tesseract: two ends plus one per cube face?"], r`$2+6=8$ cubes.`),
        ex("geo2-4", r`Compute the Euler characteristic $V-E+F-C$ using $V=16$, $E=32$, $F=24$, $C=8$.`, ["0"], [r`$16-32+24-8$.`], ["Add the positive terms first.", "Subtract the others."], r`$16-32+24-8=0$, as for every 3-sphere-like boundary.`, 10),
      ],
    },
    {
      slug: "ricci-flow",
      title: "Ricci Flow",
      summary: "A heat equation for geometry, and how it helped solve the Poincaré conjecture.",
      minutes: 10,
      level: "advanced",
      concept: [
        { type: "p", text: r`Heat spreads out until a metal plate has an even temperature. Ricci flow does something similar to geometry itself: it evolves the metric $g$, the rule for measuring distances, so that irregularities in curvature smooth out.` },
        { type: "math", tex: r`\dfrac{\partial g}{\partial t} = -2\,\mathrm{Ric}(g)` },
        { type: "callout", title: "Where it was used", text: r`Richard Hamilton introduced the flow in 1982. In 2002–2003 Grigori Perelman added the missing control of singularities (using surgery) and so proved Thurston's geometrization conjecture, which contains the Poincaré conjecture: every simply connected closed 3-manifold is a 3-sphere.` },
        { type: "callout", title: "About the demo", text: r`The demo below is a one-dimensional analogy: a bumpy closed curve under heat flow. Bump number $k$ fades like $e^{-k^2t}$, so sharp, high-frequency bumps vanish first. Real Ricci flow acts on the metric of a whole manifold.` },
      ],
      demo: "ricci",
      problems: [
        mc("geo3-1", "The Poincaré conjecture (now a theorem) says every simply connected closed 3-manifold is…", ["a 3-sphere", "a torus", "a cube", "a plane"], 0,
          ["Think of the 2D version: a closed surface with no holes."], ["Which closed surface has no holes?", "What is its 3D analogue?"], "Perelman's work shows it is topologically a 3-sphere."),
        mc("geo3-2", "Under (unnormalized) Ricci flow, a round 2-sphere, which has positive curvature everywhere…", ["shrinks to a point in finite time", "expands forever", "stays the same", "turns into a torus"], 0,
          [r`Positive curvature makes the flow shrink distances.`], ["What does −2Ric do where curvature is positive?", "Does it grow or shrink?"], "Positive curvature shrinks, and the sphere collapses to a point in finite time."),
        ex("geo3-3", r`In the toy model, bump number $k$ fades like $e^{-k^2t}$. What fraction of a $k=2$ bump is left at $t=0.5$? Enter it exactly, e.g. exp(-3)`, ["exp(-2)"],
          [r`Compute $k^2t=4\cdot0.5$.`], ["What is k²·t here?", "What goes inside exp(...)?"], r`$e^{-2}\approx13.5\%$.`, 15),
        mc("geo3-4", "Why do the sharpest bumps vanish first in the toy model?", ["Their decay rate k² is largest", "They are the tallest", "They are removed at random", "They are the most symmetric"], 0,
          ["Compare e^{-4t} with e^{-169t}."], ["Which decays faster, k=2 or k=13?", "What does the rate depend on?"], r`The rate grows like $k^2$, so larger $k$ dies off much faster.`),
      ],
    },
  ],
};
