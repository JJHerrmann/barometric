import Link from "next/link";

export default function MigrainePressureTrackerPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-100">
      <h1 className="text-3xl font-semibold">Migraine Pressure Tracker</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-200/90">
        Barometer.Rook.Works helps you track barometric pressure patterns that may correlate with
        migraine timing. This is a data visualization and pattern-tracking tool only and does not
        provide medical advice, diagnosis, or treatment guidance.
      </p>
      <section className="mt-6 space-y-3 text-sm text-slate-200/90">
        <h2 className="text-xl font-semibold text-slate-50">How to use the tracker</h2>
        <p>
          1. Pick a station to view the latest pressure trend and rate of change in dual units.
        </p>
        <p>
          2. Compare deltas across 1h, 3h, 6h, and 24h windows to spot rapid shifts.
        </p>
        <p>
          3. Log your own observations alongside the chart to build a personal pattern history.
        </p>
      </section>
      <section className="mt-6 text-sm text-slate-200/90">
        <h2 className="text-xl font-semibold text-slate-50">Related pages</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link href="/" className="text-indigo-200 hover:text-indigo-100 underline">
            Home
          </Link>
          <Link href="/faq" className="text-indigo-200 hover:text-indigo-100 underline">
            FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
