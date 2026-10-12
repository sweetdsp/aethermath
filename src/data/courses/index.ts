import type { Course, Lesson } from "@/lib/types";
import { algebra } from "./algebra";
import { calculus } from "./calculus";

export const courses: Course[] = [algebra, calculus];

export const getCourse = (topic: string) => courses.find((c) => c.topic === topic);

export function getLesson(topic: string, slug: string) {
  const course = getCourse(topic);
  const index = course?.lessons.findIndex((l) => l.slug === slug) ?? -1;
  return course && index >= 0 ? { course, lesson: course.lessons[index] as Lesson, index } : null;
}
