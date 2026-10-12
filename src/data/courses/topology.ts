import type { Course } from "@/lib/types";
import { ex, mc } from "./helpers";

const r = String.raw;

export const topology: Course = {
  topic: "topology",
  title: "Topology & Algebraic Structure",
  lessons: [
    {
      slug: "k-theory",
      title: "K-Theory",
      summary: "Turning vector bundles into a group, the way integers come from counting numbers.",
      minutes: 11,
      level: "advanced",
      concept: [
        { type: "p", text: r`Over a space $X$, a vector bundle attaches a vector space to every point in a twisting but continuous way. Bundles can be added (direct sum) but not subtracted. K-theory fixes that by allowing formal differences $[E]-[F]$, in the same way the integers are built from the counting numbers.` },
        { type: "math", tex: r`K_0(X)=\{\,[E]-[F]\,\}` },
        { type: "callout", title: "The Grothendieck construction", text: r`Treat a pair $(a,b)$ as the formal difference $a-b$. Two pairs are the same element when $a+d=c+b$. Applied to bundles, this is the definition of $K_0$. Over a single point a bundle is just a vector space, and $K_0(\mathrm{pt})=\mathbb{Z}$ via dimension.` },
        { type: "callout", title: "Why it matters", text: r`Bott periodicity: complex K-theory repeats with period $2$, which makes it an easy-to-compute generalized cohomology theory. The same idea applied to a ring's projective modules gives algebraic K-theory, where $K_0$ and $K_1$ (related to units) encode arithmetic information.` },
        { type: "p", text: r`Move the sliders: the two points on the number line coincide exactly when the pairs represent the same element.` },
      ],
      widget: {
        sliders: [
          { key: "a", label: "a", min: 0, max: 10, step: 1, initial: 7 },
          { key: "b", label: "b", min: 0, max: 10, step: 1, initial: 3 },
          { key: "c", label: "c", min: 0, max: 10, step: 1, initial: 5 },
          { key: "d", label: "d", min: 0, max: 10, step: 1, initial: 1 },
        ],
        plots: [],
        equation: r`(a,b)=([[a]],[[b]]) \;\to\; [[=a-b]] \qquad (c,d)=([[c]],[[d]]) \;\to\; [[=c-d]]`,
        xRange: [-10, 10], yRange: [-3, 3],
        points: [{ x: "a-b", y: "1", label: "a−b" }, { x: "c-d", y: "-1", label: "c−d" }],
        readouts: [{ label: "a + d", expr: "a+d" }, { label: "c + b", expr: "c+b" }, { label: "(a+d) − (c+b)", expr: "(a+d)-(c+b)" }],
        caption: "Same element exactly when (a+d) − (c+b) = 0.",
      },
      problems: [
        ex("top1-1", r`In the group built from the counting numbers, which integer does the pair $(7,3)$ represent?`, ["4"], [r`The pair $(a,b)$ means $a-b$.`], ["What does (a, b) stand for?", "What is 7 − 3?"], r`$(7,3)\mapsto7-3=4$.`, 5),
        mc("top1-2", r`Which pair represents the same element as $(5,2)$?`, ["(8,5)", "(7,3)", "(2,5)", "(6,2)"], 0,
          [r`Check $a+d=c+b$, or just compare the differences.`], ["What is 5 − 2?", "Which pair also has difference 3?"], r`$8-5=3=5-2$, so $(8,5)\sim(5,2)$.`),
        ex("top1-3", r`Over a point, a vector bundle is a vector space and $K_0(\mathrm{pt})=\mathbb{Z}$ via dimension. What integer is $[\mathbb{C}^5]-[\mathbb{C}^2]$?`, ["3"], [r`Replace each space by its dimension.`], ["What integer does C⁵ correspond to?", "Subtract."], r`$5-2=3$.`, 10),
        mc("top1-4", "Bott periodicity says complex K-theory repeats with period…", ["2", "1", "4", "8"], 0,
          ["Real K-theory has the longer period."], ["Is complex K-theory the shorter or the longer repeat?", "Does K^{-2} look like K^0?"], r`Complex K-theory has period $2$ (real K-theory has period $8$).`, 5),
      ],
    },
    {
      slug: "cohomology-of-varieties",
      title: "Cohomology of Varieties",
      summary: "Counting holes in algebraic shapes, and how that counts points over finite fields.",
      minutes: 11,
      level: "advanced",
      concept: [
        { type: "p", text: r`Cohomology attaches to a space $X$ a list of vector spaces $H^0,H^1,H^2,\dots$. Their dimensions, the Betti numbers $b_i$, count $i$-dimensional holes. Combine them into a single number, the Euler characteristic:` },
        { type: "math", tex: r`\chi(X)=\sum_i(-1)^i\,b_i` },
        { type: "callout", title: "Curves are surfaces with holes", text: r`A smooth complex algebraic curve is a surface with $g$ holes (genus $g$): $b_0=1$, $b_1=2g$, $b_2=1$, so $\chi=2-2g$. An elliptic curve over $\mathbb{C}$ is a torus ($g=1$).` },
        { type: "callout", title: "Why algebraic geometers care", text: r`The Weil conjectures say that the number of points of $X$ over a finite field $\mathbb{F}_q$ is an alternating sum of traces of Frobenius on cohomology. For projective space this gives $\#\mathbb{P}^n(\mathbb{F}_q)=1+q+\dots+q^n$: one class in each even degree, with Frobenius acting by $q^k$. Grothendieck's étale cohomology made this work, and Deligne completed the proof in 1974.` },
      ],
      demo: "genus",
      problems: [
        ex("top2-1", r`What is the Euler characteristic of a surface of genus $3$?`, ["-4"], [r`Use $\chi=2-2g$.`], ["What is g here?", "Compute 2 − 2g."], r`$2-2\cdot3=-4$.`, 5),
        ex("top2-2", r`What is $b_1$ of a surface of genus $2$?`, ["4"], [r`$b_1=2g$.`], ["What is the formula for b₁?", "Plug in g = 2."], r`$b_1=2\cdot2=4$.`, 5),
        ex("top2-3", r`The cohomology of $\mathbb{P}^2$ has one class each in degrees $0$, $2$, $4$, where Frobenius acts as $1$, $q$, $q^2$. How many points does $\mathbb{P}^2$ have over $\mathbb{F}_q$? Enter an expression in $q$.`, ["q^2+q+1"],
          ["Add up the Frobenius eigenvalues.", r`$1+q+q^2$.`], ["Which classes contribute, and with what sign?", "All degrees are even, so what about the signs?"], r`$\#\mathbb{P}^2(\mathbb{F}_q)=1+q+q^2$.`, 15),
        mc("top2-4", "As a topological space, an elliptic curve over the complex numbers is…", ["a torus", "a sphere", "a circle", "a line"], 0,
          [r`Its genus is $1$.`], ["How many holes does genus 1 mean?", "Which familiar surface has exactly one hole?"], "Genus 1 means one hole: a torus."),
      ],
    },
    {
      slug: "atiyah-hirzebruch-spectral-sequence",
      title: "The Atiyah–Whitehead–Hirzebruch Spectral Sequence",
      summary: "A bookkeeping device for computing generalized cohomology cell by cell.",
      minutes: 12,
      level: "research",
      concept: [
        { type: "p", text: r`To compute a generalized cohomology theory $E^*(X)$ (K-theory, cobordism, ...), build $X$ from cells, start with ordinary cohomology using $E$'s values on a point as coefficients, then correct it with differentials. Atiyah and Hirzebruch did this for K-theory, and Whitehead generalized it to any theory, so you will also see it called the AHSS.` },
        { type: "math", tex: r`E_2^{p,q}=H^p\big(X;E^q(\mathrm{pt})\big)\;\Longrightarrow\;E^{p+q}(X)` },
        { type: "callout", title: "Differentials", text: r`Each page $E_{r+1}$ is the cohomology of $E_r$ under $d_r:E_r^{p,q}\to E_r^{p+r,\,q-r+1}$. These maps raise the total degree $p+q$ by exactly $1$. At the end, $E_\infty$ gives the graded pieces of $E^*(X)$.` },
        { type: "callout", title: "The simplest case: spheres", text: r`A sphere $S^n$ has cells only in dimensions $0$ and $n$. A basepoint splits off the column $p=0$, so every differential vanishes and the sequence collapses at $E_2$: $\tilde E^m(S^n)\cong E^{m-n}(\mathrm{pt})$. Explore the $E_2$ page below.` },
      ],
      demo: "spectral",
      problems: [
        mc("top3-1", "In the AHSS, the $E_2$ page entry $E_2^{p,q}$ is…", [r`$H^p(X;E^q(\mathrm{pt}))$`, r`$H^q(X;E^p(\mathrm{pt}))$`, r`$E^{p+q}(X)$`, r`$\pi_p(X)$`], 0,
          [r`The first index is the cell dimension, the second labels coefficients.`], ["Which index is the cohomology degree?", "Which one picks the coefficient group?"], r`$E_2^{p,q}=H^p(X;E^q(\mathrm{pt}))$.`, 5),
        ex("top3-2", r`A $d_3$ differential starts at $(p,q)=(1,4)$. What is the $p$-coordinate of its target? ($d_r$ goes from $(p,q)$ to $(p+r,\,q-r+1)$.)`, ["4"], [r`Add $r=3$ to $p$.`], ["What does d_r do to p?", "What is 1 + 3?"], r`$p+r=1+3=4$.`, 10),
        ex("top3-3", r`...and the $q$-coordinate of that target?`, ["2"], [r`$q-r+1=4-3+1$.`], ["What does d_r do to q?", "Compute 4 − 3 + 1."], r`$q-r+1=2$, so $d_3:(1,4)\to(4,2)$. The total degree went from $5$ to $6$.`, 10),
        mc("top3-4", "If a differential starts in total degree $m=p+q$, its target has total degree…", [r`$m+1$`, r`$m$`, r`$m-1$`, r`$m+r$`], 0,
          [r`Check with the example: $(1,4)\to(4,2)$.`], ["What was the source degree and the target degree in the example?", "Does it depend on r?"], "Differentials always raise total degree by 1."),
      ],
    },
  ],
};
