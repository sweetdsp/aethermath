import { Navbar } from "@/components/layout/Navbar";
import { ComponentsDemo } from "@/components/layout/ComponentsDemo";

// Temporary: Step 4 replaces this with real lesson data and the 3-pane layout.
export default async function LessonPage({ params }: { params: Promise<{ topic: string; lesson: string }> }) {
  const { topic, lesson } = await params;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-muted">{topic} / {lesson}</p>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Component playground</h1>
        <ComponentsDemo />
      </main>
    </>
  );
}
