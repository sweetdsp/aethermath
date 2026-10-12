import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { LessonView } from "@/components/lesson/LessonView";
import { courses, getLesson } from "@/data/courses";

type Params = Promise<{ topic: string; lesson: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.flatMap((c) => c.lessons.map((l) => ({ topic: c.topic, lesson: l.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { topic, lesson } = await params;
  const found = getLesson(topic, lesson);
  return { title: found ? `${found.lesson.title} · AetherMath` : "AetherMath" };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { topic, lesson: slug } = await params;
  const found = getLesson(topic, slug);
  if (!found) notFound();
  const { course, lesson, index } = found;
  const brief = (i: number) => (course.lessons[i] ? { slug: course.lessons[i].slug, title: course.lessons[i].title } : null);

  return (
    <>
      <Navbar />
      <LessonView topic={topic} courseTitle={course.title} lesson={lesson} index={index} total={course.lessons.length} prev={brief(index - 1)} next={brief(index + 1)} />
    </>
  );
}
