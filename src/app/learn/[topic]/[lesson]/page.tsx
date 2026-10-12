export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string; lesson: string }>;
}) {
  const { topic, lesson } = await params;
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        {topic} / {lesson}
      </h1>
      <p className="mt-2 text-muted">Concept · Practice · MathCopilot panes (coming soon).</p>
    </main>
  );
}
