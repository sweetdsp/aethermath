import type { Course } from "@/lib/types";
import { ex, mc } from "./helpers";

const r = String.raw;

export const numberTheory: Course = {
  topic: "number-theory",
  title: "Arithmetic Geometry",
  lessons: [
    {
      slug: "p-adic-hodge-theory",
      title: "p-adic Hodge Theory",
      summary: "Measuring closeness by divisibility, and comparing Galois representations with geometry.",
      minutes: 12,
      level: "research",
      concept: [
        { type: "p", text: r`The $p$-adic numbers measure size differently: a number is small when it is divisible by a high power of a prime $p$. Two integers are close when their difference is highly divisible by $p$.` },
        { type: "math", tex: r`|n|_p=p^{-v_p(n)}` },
        { type: "callout", title: "The question", text: r`For a variety $X$ over a $p$-adic field $K$, the absolute Galois group of $K$ acts on the étale cohomology $H^i_{\text{ét}}(X_{\bar K},\mathbb{Q}_p)$. Which $p$-adic Galois representations arise from geometry like this, and how do they relate to the geometry itself?` },
        { type: "callout", title: "Comparison theorems", text: r`Tate, Fontaine, Faltings and others built period rings ($B_{HT}$, $B_{dR}$, $B_{crys}$, $B_{st}$) that translate between the Galois side and Hodge and de Rham cohomology. The simplest is the Hodge–Tate decomposition:` },
        { type: "math", tex: r`H^n_{\text{ét}}(X_{\bar K},\mathbb{Q}_p)\otimes\mathbb{C}_p\;\cong\;\bigoplus_i H^{n-i}(X,\Omega^i)\otimes\mathbb{C}_p(-i)` },
        { type: "p", text: r`Try the toy below to build intuition for $p$-adic size.` },
      ],
      demo: "padic",
      problems: [
        ex("nt1-1", r`What is $v_2(48)$, the largest power of $2$ dividing $48$?`, ["4"], [r`$48=16\cdot3$.`], ["Keep dividing 48 by 2 until it is odd.", "How many divisions did you make?"], r`$48=2^4\cdot3$, so $v_2(48)=4$.`, 5),
        ex("nt1-2", r`What is $|48|_2$? (enter a fraction)`, ["1/16"], [r`$|n|_p=p^{-v_p(n)}$.`], ["What is v₂(48)?", "What is 2 to the minus that power?"], r`$|48|_2=2^{-4}=\tfrac1{16}$.`, 10),
        mc("nt1-3", "Which number is $2$-adically closest to $1$?", [r`$1+2^{10}$`, r`$1+2^2$`, r`$1+2$`, r`$1+3$`], 0,
          [r`Look at the difference from $1$: $2^{10}$, $2^2$, $2$, $3$.`], ["Which difference is divisible by the highest power of 2?", "Is that difference 2-adically big or small?"], r`$|2^{10}|_2=2^{-10}$ is the smallest distance.`),
        mc("nt1-4", "At its core, $p$-adic Hodge theory compares…", ["étale (Galois) cohomology with Hodge / de Rham cohomology", "real numbers with complex numbers", "derivatives with integrals", "finite groups with infinite groups"], 0,
          ["The Hodge–Tate decomposition has étale cohomology on one side."], ["Which side carries a Galois action?", "Which side involves differential forms?"], "It builds a dictionary between the two kinds of cohomology."),
      ],
    },
    {
      slug: "shimura-reciprocity",
      title: "Shimura Reciprocity",
      summary: "How Galois symmetry acts on special values of modular functions, via the cyclotomic model.",
      minutes: 12,
      level: "research",
      concept: [
        { type: "p", text: r`Class field theory describes the abelian extensions of a number field. Over $\mathbb{Q}$, the Kronecker–Weber theorem says every abelian extension sits inside a cyclotomic field $\mathbb{Q}(\zeta_n)$, and the Galois group is explicit:` },
        { type: "math", tex: r`\mathrm{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q})\cong(\mathbb{Z}/n\mathbb{Z})^\times,\qquad \sigma_a:\zeta\mapsto\zeta^a` },
        { type: "callout", title: "The imaginary quadratic analogue", text: r`For an imaginary quadratic field $K$, the role of roots of unity is played by special values of modular functions such as $j(\tau)$ at CM points $\tau\in K$ (Kronecker's Jugendtraum, a case of Hilbert's 12th problem). Shimura reciprocity says exactly how Galois elements act on those values, in terms of ideles acting on modular functions. Example: $j(i)=1728$, and $j\big(\tfrac{1+\sqrt{-163}}{2}\big)=-640320^3$, which is why $e^{\pi\sqrt{163}}$ is almost an integer.` },
        { type: "callout", title: "A note on scope", text: r`Zeta and $L$-function values belong to neighbouring conjectures (Deligne, Birch–Swinnerton-Dyer), not to Shimura reciprocity itself. The demo below shows the cyclotomic model, the one-dimensional-down version of the idea.` },
      ],
      demo: "roots",
      problems: [
        ex("nt2-1", r`How many units does $\mathbb{Z}/12\mathbb{Z}$ have, i.e. what is $\varphi(12)$?`, ["4"], [r`Count $k$ in $1..11$ with $\gcd(k,12)=1$.`], ["Which numbers share no factor with 12?", "1, 5, 7, 11. How many?"], r`The units are $1,5,7,11$, so $\varphi(12)=4$.`, 10),
        ex("nt2-2", r`In $\mathrm{Gal}(\mathbb{Q}(\zeta_7)/\mathbb{Q})$ the element $\sigma_2$ sends $\zeta\mapsto\zeta^2$. It sends $\zeta^3$ to $\zeta^k$ with $k=\,$?`, ["6"], [r`$\sigma_2(\zeta^3)=(\zeta^2)^3$.`], ["What do you get by raising ζ² to the 3rd power?", "Reduce mod 7."], r`$(\zeta^2)^3=\zeta^6$.`, 10),
        mc("nt2-3", r`What is $j(i)$, the $j$-invariant at $\tau=i$?`, ["1728", "0", "1", "i"], 0,
          [r`It is $12^3$.`], ["Is it a Gaussian integer or a real number?", "Is it the famous cube 12³?"], r`$j(i)=1728=12^3$.`, 5),
        mc("nt2-4", "Kronecker–Weber says every finite abelian extension of $\\mathbb{Q}$ lies in…", ["a cyclotomic field", "the field generated by √2", "the real numbers", "no single family"], 0,
          ["The Galois group acts on roots of unity."], ["What are the natural extensions of Q generated by roots of unity called?", "Do they cover all the abelian ones?"], "Every finite abelian extension of $\\mathbb{Q}$ is contained in some $\\mathbb{Q}(\\zeta_n)$.", 5),
      ],
    },
    {
      slug: "tate-shafarevich-group",
      title: "The Tate–Shafarevich Group",
      summary: "When an equation is solvable everywhere locally but nowhere globally.",
      minutes: 12,
      level: "research",
      concept: [
        { type: "p", text: r`Sometimes an equation has solutions in $\mathbb{R}$ and in every $\mathbb{Q}_p$, yet none in $\mathbb{Q}$: the local-to-global (Hasse) principle fails. Selmer's cubic $3x^3+4y^3+5z^3=0$ is the classic example.` },
        { type: "math", tex: r`\text{Ш}(E/K)=\ker\Big(H^1(K,E)\to\prod_v H^1(K_v,E)\Big)` },
        { type: "callout", title: "What it measures", text: r`For an elliptic curve $E$, the elements of Ш are torsors of $E$ (curves that look like $E$ over $\bar K$) that have points in every completion $K_v$ but no point over $K$. So Ш measures exactly how badly the local-to-global principle fails for $E$.` },
        { type: "callout", title: "Open problems", text: r`It is conjectured that Ш is always finite, and if so its order is a perfect square (Cassels–Tate pairing). It appears in the Birch–Swinnerton-Dyer formula. Finiteness is known in some cases, e.g. for curves over $\mathbb{Q}$ of analytic rank $0$ or $1$ (Kolyvagin), but not in general.` },
        { type: "p", text: r`Below, an elliptic curve $y^2=x^3+ax+b$. It is genuinely an elliptic curve only when the discriminant $\Delta=-16(4a^3+27b^2)$ is nonzero.` },
      ],
      widget: {
        sliders: [
          { key: "a", label: "a", min: -3, max: 3, step: 0.1, initial: -1 },
          { key: "b", label: "b", min: -3, max: 3, step: 0.1, initial: 1 },
        ],
        plots: [{ expr: "sqrt(x^3+a*x+b)", label: "upper" }, { expr: "-sqrt(x^3+a*x+b)", label: "lower" }],
        equation: r`y^2 = x^3 [[+a]]x [[+b]] \qquad \Delta=[[=-16*(4*a^3+27*b^2)]]`,
        xRange: [-4, 4], yRange: [-5, 5],
        readouts: [{ label: "discriminant Δ", expr: "-16*(4*a^3+27*b^2)" }],
      },
      problems: [
        ex("nt3-1", r`Compute $\Delta=-16(4a^3+27b^2)$ for $y^2=x^3-x$ (so $a=-1$, $b=0$).`, ["64"], [r`$4a^3=4\cdot(-1)^3=-4$.`], ["What is a³ when a = −1?", "What does the minus sign in front of 16 do to −4?"], r`$-16\cdot(-4)=64$.`, 10),
        mc("nt3-2", r`The curve $y^2=x^3+ax+b$ is nonsingular (an elliptic curve) when $\Delta$ is…`, ["nonzero", "zero", "positive", "negative"], 0,
          ["Try b = a = 0 in the widget."], ["What happens to the graph when Δ = 0?", "Can it still be smooth?"], r`$\Delta=0$ means a repeated root, hence a singular point.`, 5),
        mc("nt3-3", "If Ш is finite, which of these can NOT be its order?", ["2", "4", "9", "16"], 0,
          ["Cassels–Tate: the order is a perfect square."], ["Which of these are squares?", "Which is not?"], r`$4,9,16$ are squares; $2$ is not.`, 10),
        mc("nt3-4", "Ш measures the failure of…", ["the local-to-global principle", "Fermat's last theorem", "Euler's formula", "the triangle inequality"], 0,
          ["Think of Selmer's cubic."], ["What is true locally for every place but false globally?", "Which principle is that?"], "Torsors solvable everywhere locally but not globally.", 5),
      ],
    },
    {
      slug: "iut-abc-conjecture",
      title: "The abc Conjecture & Inter-universal Teichmüller Theory",
      summary: "A deceptively simple statement about addition and primes, and a controversial attempt to prove it.",
      minutes: 13,
      level: "research",
      concept: [
        { type: "p", text: r`Take coprime positive integers with $a+b=c$. The radical $\mathrm{rad}(n)$ is the product of the distinct primes dividing $n$. The abc conjecture says $c$ cannot be much larger than $\mathrm{rad}(abc)$. Measure that with the quality:` },
        { type: "math", tex: r`q(a,b,c)=\dfrac{\ln c}{\ln\,\mathrm{rad}(abc)}` },
        { type: "callout", title: "The conjecture", text: r`For every $\varepsilon>0$, only finitely many coprime triples $a+b=c$ have $q>1+\varepsilon$. It would imply many results, such as Fermat's Last Theorem for large exponents and effective versions of Faltings' theorem. Try triples in the demo: high-quality ones are rare.` },
        { type: "callout", title: "Inter-universal Teichmüller theory", text: r`In 2012 Shinichi Mochizuki announced IUT, an extremely abstract framework (Hodge theaters, Frobenioids, log-theta lattices) that compares two arithmetic "universes" without a common ring structure, aiming to prove a Diophantine inequality that implies abc.` },
        { type: "callout", title: "Status: contested", text: r`The papers were published in Publications of RIMS in 2021, but other leading number theorists, notably Peter Scholze and Jakob Stix (2018), say the key step (Corollary 3.12) contains a gap that cannot be repaired. Mochizuki disputes this. The mathematical community has not accepted the claimed proof, and the abc conjecture is generally regarded as open.` },
      ],
      demo: "abc",
      problems: [
        ex("nt4-1", r`Compute $\mathrm{rad}(360)$. ($360=2^3\cdot3^2\cdot5$)`, ["30"], [r`Keep each distinct prime once.`], ["Which distinct primes divide 360?", "Multiply them."], r`$2\cdot3\cdot5=30$.`, 5),
        ex("nt4-2", r`Find the quality $q$ of $(a,b,c)=(1,8,9)$. Type it with $\ln$.`, ["ln(9)/ln(6)"], [r`$abc=72=2^3\cdot3^2$, so $\mathrm{rad}(abc)=6$.`], ["What is rad(1·8·9)?", "Which number is c?"], r`$q=\ln9/\ln6\approx1.226$: an abc "hit" ($q>1$).`, 15),
        mc("nt4-3", r`The abc conjecture says that for every $\varepsilon>0$ there are only finitely many coprime triples with quality greater than…`, [r`$1+\varepsilon$`, "2", r`$\varepsilon$`, r`$1-\varepsilon$`], 0,
          ["Typical triples have q ≤ 1."], ["What quality is the 'normal' threshold?", "How is epsilon added?"], r`Only finitely many triples can exceed $q=1+\varepsilon$.`, 5),
        mc("nt4-4", "Which best describes the status of Mochizuki's IUT proof of abc?", ["Published in 2021 but disputed by experts who report a gap; not broadly accepted", "Universally accepted as a correct proof", "Disproved by an explicit counterexample", "Never written up in any paper"], 0,
          ["Both a publication and a dispute exist."], ["Was it published?", "Do other experts agree it is correct?"], "As described above: published, but contested.", 5),
      ],
    },
  ],
};
