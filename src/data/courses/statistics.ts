import type { Course } from "@/lib/types";
import { ex, mc } from "./helpers";

const r = String.raw;

export const statistics: Course = {
  topic: "statistics",
  title: "Data & Probability",
  lessons: [
    {
      slug: "center-and-spread",
      title: "Center & Spread",
      summary: "Mean, median and standard deviation: three ways to summarise a data set, and when each misleads.",
      minutes: 9,
      concept: [
        { type: "p", text: r`A pile of numbers is hard to read, so we summarise it with a center (a typical value) and a spread (how scattered the values are).` },
        { type: "math", tex: r`\bar x=\dfrac{1}{n}\sum x_i,\qquad \sigma=\sqrt{\dfrac{1}{n}\sum (x_i-\bar x)^2}` },
        { type: "callout", title: "Mean vs median", text: r`The mean is the balance point of the data and gets dragged by extreme values. The median is the middle value and mostly ignores them, which is why incomes and house prices are usually reported as medians.` },
        { type: "callout", title: "Standard deviation", text: r`$\sigma$ is the typical distance of a value from the mean. Here it is the population version (divide by $n$); for a sample you divide by $n-1$ instead.` },
        { type: "p", text: r`Add an extra value to the data set below and drag it outward. Watch which measure moves.` },
      ],
      demo: "spread",
      problems: [
        ex("stat1-1", r`Find the mean of $2,\,4,\,6,\,8,\,10$.`, ["6"], ["Add them up, then divide by how many there are."], ["What is the sum?", "How many values are there?"], r`$30/5=6$.`, 5),
        ex("stat1-2", r`Find the median of $3,\,9,\,1,\,7,\,5$.`, ["5"], ["Sort first."], ["What order do the numbers go in?", "Which is in the middle of 5 values?"], r`Sorted: $1,3,5,7,9$. The middle value is $5$.`, 5),
        mc("stat1-3", "Which summary is least affected by one extreme outlier?", ["the mean", "the median", "the range", "the sum"], 1,
          ["Which ones depend on every single value's size?"], ["If one value becomes huge, which statistic changes the most?", "Which one only looks at the middle position?"], "The median depends only on the middle position, so one extreme value barely moves it."),
        ex("stat1-4", r`Find the population standard deviation of $2,4,4,4,5,5,7,9$. (The mean is $5$.)`, ["2"],
          [r`Square each distance from $5$: $9,1,1,1,0,0,4,16$.`, "Average those, then take the square root."], ["What do the squared distances add up to?", "What is that divided by 8, and its square root?"], r`$\sqrt{32/8}=\sqrt4=2$.`, 15),
      ],
    },
    {
      slug: "normal-distribution",
      title: "The Normal Distribution",
      summary: "The bell curve, the 68–95–99.7 rule, and z-scores.",
      minutes: 10,
      concept: [
        { type: "p", text: r`Heights, measurement errors and many averages follow a bell-shaped curve, the normal distribution. Only two numbers control it: the mean $\mu$ (where the peak sits) and the standard deviation $\sigma$ (how wide it is).` },
        { type: "math", tex: r`f(x)=\dfrac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}` },
        { type: "callout", title: "The 68–95–99.7 rule", text: r`About $68\%$ of values fall within $1\sigma$ of the mean, about $95\%$ within $2\sigma$, and about $99.7\%$ within $3\sigma$. The curve always has total area $1$.` },
        { type: "callout", title: "z-scores", text: r`A z-score says how many standard deviations a value is from the mean: $z=(x-\mu)/\sigma$. It lets you compare values from different distributions.` },
        { type: "p", text: r`Slide $\mu$ and $\sigma$: the curve shifts or spreads, and as it widens its peak must drop to keep the area at $1$.` },
      ],
      widget: {
        sliders: [
          { key: "m", label: "mean μ", min: -4, max: 4, step: 0.5, initial: 0 },
          { key: "s", label: "std. dev. σ", min: 0.5, max: 3, step: 0.25, initial: 1 },
        ],
        plots: [{ expr: "exp(-(x-m)^2/(2*s^2))/(s*sqrt(2*pi))", label: "normal curve" }],
        equation: r`f(x)=\dfrac{1}{[[s]]\sqrt{2\pi}}\,e^{-\frac{(x\,[[+-m]])^2}{2\cdot[[=s^2]]}}`,
        xRange: [-10, 10], yRange: [-0.1, 0.9],
        points: [{ x: "m", y: "1/(s*sqrt(2*pi))", label: "peak" }],
        readouts: [{ label: "peak height", expr: "1/(s*sqrt(2*pi))" }, { label: "μ − σ", expr: "m-s" }, { label: "μ + σ", expr: "m+s" }],
      },
      problems: [
        mc("stat2-1", "In a normal distribution, about what percentage of values lie within one standard deviation of the mean?", ["68%", "50%", "95%", "99.7%"], 0,
          ["It is the first number in the 68–95–99.7 rule."], ["Which of the three rule numbers goes with 1σ?", "Is 1σ the narrowest or the widest band?"], r`About $68\%$ within $1\sigma$, $95\%$ within $2\sigma$.`, 5),
        ex("stat2-2", r`Heights are normal with $\mu=170$ and $\sigma=8$. What is the z-score of a person who is $186$ cm tall?`, ["2"], [r`$z=(x-\mu)/\sigma$.`], ["How far above the mean is 186?", "How many σ is that?"], r`$(186-170)/8=2$: two standard deviations above the mean.`, 10),
        mc("stat2-3", r`If $\sigma$ doubles (and the area stays $1$), the height of the peak…`, ["halves", "doubles", "stays the same", "quadruples"], 0,
          [r`The peak height is $\dfrac{1}{\sigma\sqrt{2\pi}}$.`], ["What happens to 1/σ when σ doubles?", "Try it with the σ slider."], r`Peak $=1/(\sigma\sqrt{2\pi})$, so doubling $\sigma$ halves it.`, 10),
        ex("stat2-4", r`Test scores have $\mu=100$ and $\sigma=15$. What score has $z=-1.5$?`, ["77.5"], [r`$x=\mu+z\sigma$.`], ["What is z·σ?", "Add it to the mean."], r`$100+(-1.5)(15)=77.5$.`, 10),
      ],
    },
    {
      slug: "law-of-large-numbers",
      title: "Probability & the Law of Large Numbers",
      summary: "Why short runs look random but long runs settle down.",
      minutes: 9,
      concept: [
        { type: "p", text: r`A probability is a long-run frequency. A fair coin has $P(\text{heads})=\tfrac12$, which does not mean any 10 flips split 5–5, only that over many flips the share of heads settles near $\tfrac12$.` },
        { type: "math", tex: r`\dfrac{\text{heads}}{n}\;\longrightarrow\;p\quad\text{as } n\to\infty` },
        { type: "callout", title: "Law of large numbers", text: r`As you repeat an experiment, the observed proportion gets closer and closer to the true probability. Early values can swing wildly; later ones barely move.` },
        { type: "callout", title: "The gambler's fallacy", text: r`Flips are independent: a coin has no memory. After five heads in a row the next flip is still $\tfrac12$. The law of large numbers works by dilution, not by the coin "catching up".` },
        { type: "p", text: r`Flip the coin below, then change $P(\text{heads})$ to a biased coin and watch the proportion find the new value.` },
      ],
      demo: "lln",
      problems: [
        mc("stat3-1", "A fair coin has landed heads on 7 of its first 10 flips. As the number of flips grows without bound, the proportion of heads…", ["approaches 0.5", "stays at 0.7", "approaches 1", "becomes exactly 0.5 after 100 flips"], 0,
          ["Which number is the coin's true probability?"], ["What is P(heads) for a fair coin?", "Does the early streak change that?"], "The early excess gets diluted by later flips, so the proportion approaches $0.5$."),
        ex("stat3-2", r`What is the probability of getting at least one head in $3$ fair flips? (enter a fraction)`, ["7/8"], [r`Easier: $1-P(\text{no heads})$.`, r`$P(\text{all tails})=(\tfrac12)^3$.`], ["What is the probability of three tails in a row?", "How does 'at least one head' relate to that?"], r`$1-\tfrac18=\tfrac78$.`, 10),
        mc("stat3-3", "After five heads in a row, the chance the next flip is heads is…", ["still 1/2", "greater than 1/2", "less than 1/2", "0"], 0,
          ["Does the coin remember its previous results?"], ["Are the flips independent?", "What does independence say about the next flip?"], r`Independent flips: the next one is $\tfrac12$ regardless of the past.`, 5),
        ex("stat3-4", r`A coin has $P(\text{heads})=0.3$. What is the expected number of heads in $200$ flips?`, ["60"], [r`Expected count $=n\cdot p$.`], ["What are n and p?", "Multiply them."], r`$200\times0.3=60$.`, 10),
      ],
    },
    {
      slug: "correlation-and-regression",
      title: "Correlation & the Line of Best Fit",
      summary: "Measuring how two variables move together, and fitting the best straight line.",
      minutes: 11,
      concept: [
        { type: "p", text: r`When two measurements tend to rise and fall together we say they are correlated. The correlation coefficient $r$ measures how closely the points follow a straight line, from $-1$ (perfect downhill) through $0$ (no linear relationship) to $+1$ (perfect uphill).` },
        { type: "math", tex: r`\hat y=mx+b,\qquad \text{residual}=y-\hat y` },
        { type: "callout", title: "Least squares", text: r`The line of best fit minimises the sum of the squared residuals (SSE). It always passes through the point of means $(\bar x,\bar y)$, so $b=\bar y-m\bar x$.` },
        { type: "callout", title: "Correlation is not causation", text: r`Ice-cream sales and drownings both rise in summer. A strong $r$ says the variables move together, not that one causes the other.` },
        { type: "p", text: r`Drag your own line to shrink the SSE, then reveal the least-squares line and compare.` },
      ],
      demo: "regression",
      problems: [
        ex("stat4-1", r`A best-fit line has slope $m=2$ and passes through the means $(\bar x,\bar y)=(3,7)$. What is its intercept $b$?`, ["1"], [r`$b=\bar y-m\bar x$.`], ["What is m·x̄?", "Subtract it from ȳ."], r`$b=7-2\cdot3=1$.`, 10),
        mc("stat4-2", r`A correlation of $r=-0.9$ means…`, ["a strong negative linear relationship", "a weak positive relationship", "no relationship", "a strong positive relationship"], 0,
          ["The sign gives the direction; the size gives the strength."], ["What does the minus sign tell you?", "Is 0.9 close to 0 or to 1?"], "Negative sign: as one goes up the other goes down. Magnitude $0.9$: very close to a line.", 5),
        mc("stat4-3", "The least-squares line is the line that minimises…", ["the sum of the squared vertical distances to the points", "the number of points not on the line", "the slope", "the largest horizontal distance"], 0,
          ["Try shrinking the SSE readout in the demo."], ["What do the red segments measure?", "Why square them before adding?"], "Least squares minimises the sum of squared residuals.", 5),
        ex("stat4-4", r`The fitted line is $\hat y=2x+1$. At $x=7$ the actual value is $y=17$. What is the residual (actual minus predicted)?`, ["2"], [r`First predict: $\hat y=2\cdot7+1$.`], ["What does the line predict at x = 7?", "Subtract that from 17."], r`$\hat y=15$, so the residual is $17-15=2$.`, 10),
      ],
    },
  ],
};
