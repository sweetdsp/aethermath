import { Sigma, Shapes, TrendingUp, BarChart3, type LucideIcon } from "lucide-react";

export type Topic = {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  /** Tailwind gradient classes for the card accent */
  gradient: string;
  /** First lesson to link to; null while the topic is "coming soon" */
  firstLesson: string | null;
  lessons: number;
};

export const topics: Topic[] = [
  {
    slug: "algebra",
    title: "Algebra",
    tagline: "Linear equations, slopes and the language of change.",
    icon: Sigma,
    gradient: "from-indigo-500/25 to-cyan-500/10",
    firstLesson: "linear-equations-slopes",
    lessons: 6,
  },
  {
    slug: "calculus",
    title: "Calculus",
    tagline: "Derivatives you can see: drag a point, watch the tangent.",
    icon: TrendingUp,
    gradient: "from-fuchsia-500/25 to-indigo-500/10",
    firstLesson: "intro-to-derivatives",
    lessons: 6,
  },
  {
    slug: "geometry",
    title: "Geometry",
    tagline: "Shapes, angles and proofs, built by hand.",
    icon: Shapes,
    gradient: "from-emerald-500/25 to-cyan-500/10",
    firstLesson: null,
    lessons: 0,
  },
  {
    slug: "statistics",
    title: "Statistics",
    tagline: "Distributions, variance and thinking with data.",
    icon: BarChart3,
    gradient: "from-amber-500/25 to-rose-500/10",
    firstLesson: null,
    lessons: 0,
  },
];
