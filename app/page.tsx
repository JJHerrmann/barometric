import Link from "next/link";

import BarometricDashboard from "@/components/dashboard/BarometricDashboardClient";

export default function HomePage() {
  return (
    <main>
      <BarometricDashboard />
      <section className="mx-auto max-w-4xl px-6 py-10 text-slate-200">
        <h1 className="text-2xl font-semibold text-slate-50">Barometric Pressure Migraine Tracker</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
          This dashboard helps you monitor barometric pressure patterns and timing so you can spot
          trends that may correlate with migraine episodes. It is a tracking and pattern-recognition
          tool only and is not medical advice or a diagnostic service.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
          Use the station selector to explore recent pressure changes, review deltas and rate of
          change, and log your own observations. For more context, visit the tracker guide or the
          FAQ.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/migraine-pressure-tracker" className="text-indigo-200 hover:text-indigo-100 underline">
            Migraine pressure tracker guide
          </Link>
          <Link href="/faq" className="text-indigo-200 hover:text-indigo-100 underline">
            FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
