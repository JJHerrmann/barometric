// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Barometric Pressure Migraine Tracker — Barometer.Rook.Works",
  description:
    "Track barometric pressure patterns and changes related to migraine risk awareness without making medical claims.",
  metadataBase: new URL("https://barometer.rook.works"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Barometric Pressure Migraine Tracker — Barometer.Rook.Works",
    description:
      "Track barometric pressure patterns and changes related to migraine risk awareness without making medical claims.",
    url: "https://barometer.rook.works",
    siteName: "Barometer.Rook.Works",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barometric Pressure Migraine Tracker — Barometer.Rook.Works",
    description:
      "Track barometric pressure patterns and changes related to migraine risk awareness without making medical claims.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-slate-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
