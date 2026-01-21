// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

const siteTitle = "Barometric Pressure Migraine Tracker | Barometer.Rook.Works";
const siteDescription =
  "Track barometric pressure patterns and changes related to migraine risk awareness without making medical claims.";
const siteUrl = "https://barometer.rook.works";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Barometer.Rook.Works",
    type: "website",
    images: [
      {
        url: "/og/barometer.svg",
        width: 1200,
        height: 630,
        alt: "Barometric Pressure Migraine Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og/barometer.svg"],
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
