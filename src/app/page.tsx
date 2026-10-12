import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { TopicGrid } from "@/components/layout/TopicGrid";
import { ContinueBanner } from "@/components/layout/ContinueBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section id="topics" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
          <div className="mb-6">
            <ContinueBanner />
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Pick a topic</h2>
            <p className="mt-1 text-muted">Every lesson pairs a live visual with adaptive practice.</p>
          </div>
          <TopicGrid />
        </section>
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        AetherMath · built for curiosity
      </footer>
    </>
  );
}
