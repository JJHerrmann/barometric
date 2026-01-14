import Link from "next/link";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this medical advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This site provides barometric pressure tracking and pattern visualization only and does not offer medical advice, diagnosis, or treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Where does the pressure data come from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The current dashboard uses mock data for demonstration. A server-side data feed is planned for a later release.",
      },
    },
    {
      "@type": "Question",
      name: "Why track pressure changes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some people like to monitor pressure patterns and timing alongside their own observations. This tool helps visualize those patterns without making claims.",
      },
    },
    {
      "@type": "Question",
      name: "Can I log migraine events here?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Event logging is planned. For now, you can use the interface to explore trends and add your own notes externally.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-100">
      <h1 className="text-3xl font-semibold">FAQ</h1>
      <p className="mt-4 text-sm text-slate-200/90">
        Common questions about the barometric pressure tracker and how to interpret its data.
      </p>

      <section className="mt-6 space-y-5 text-sm text-slate-200/90">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Is this medical advice?</h2>
          <p>
            No. This site provides barometric pressure tracking and pattern visualization only and
            does not offer medical advice, diagnosis, or treatment.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Where does the pressure data come from?</h2>
          <p>
            The current dashboard uses mock data for demonstration. A server-side data feed is
            planned for a later release.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Why track pressure changes?</h2>
          <p>
            Some people like to monitor pressure patterns and timing alongside their own
            observations. This tool helps visualize those patterns without making claims.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Can I log migraine events here?</h2>
          <p>
            Event logging is planned. For now, you can use the interface to explore trends and add
            your own notes externally.
          </p>
        </div>
      </section>

      <section className="mt-8 text-sm text-slate-200/90">
        <h2 className="text-xl font-semibold text-slate-50">Related pages</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link href="/" className="text-indigo-200 hover:text-indigo-100 underline">
            Home
          </Link>
          <Link href="/migraine-pressure-tracker" className="text-indigo-200 hover:text-indigo-100 underline">
            Migraine pressure tracker guide
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
