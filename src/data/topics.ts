import { courses } from "./courses";
import { Sigma, Shapes, TrendingUp, BarChart3, Orbit, Hash, type LucideIcon } from "lucide-react";

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

const first = (slug: string) => courses.find((c) => c.topic === slug)?.lessons[0]?.slug ?? null;
const count = (slug: string) => courses.find((c) => c.topic === slug)?.lessons.length ?? 0;

export const topics: Topic[] = [
  {
    slug: "algebra",
    title: "Algebra",
    tagline: "Linear equations, slopes and the language of change.",
    icon: Sigma,
    gradient: "from-indigo-500/25 to-cyan-500/10",
    firstLesson: first("algebra"),
    lessons: count("algebra"),
  },
  {
    slug: "calculus",
    title: "Calculus",
    tagline: "Derivatives you can see: drag a point, watch the tangent.",
    icon: TrendingUp,
    gradient: "from-fuchsia-500/25 to-indigo-500/10",
    firstLesson: first("calculus"),
    lessons: count("calculus"),
  },
  {
    slug: "geometry",
    title: "Geometry",
    tagline: "Fractals, the tesseract and Ricci flow: shapes beyond the plane.",
    icon: Shapes,
    gradient: "from-emerald-500/25 to-cyan-500/10",
    firstLesson: first("geometry"),
    lessons: count("geometry"),
  },
  {
    slug: "topology",
    title: "Topology & Algebra",
    tagline: "K-theory, cohomology and spectral sequences: the shape of structure.",
    icon: Orbit,
    gradient: "from-sky-500/25 to-indigo-500/10",
    firstLesson: first("topology"),
    lessons: count("topology"),
  },
  {
    slug: "number-theory",
    title: "Number Theory",
    tagline: "p-adics, reciprocity, elliptic curves and the abc conjecture.",
    icon: Hash,
    gradient: "from-rose-500/25 to-amber-500/10",
    firstLesson: first("number-theory"),
    lessons: count("number-theory"),
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
