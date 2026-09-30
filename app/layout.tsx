// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const siteTitle = "Barometric Pressure Migraine Tracker | Barometer.Rook.Works";
const siteDescription =
  "Track barometric pressure patterns and changes related to migraine risk awareness without making medical claims.";
const siteUrl = "https://barometer.rook.works";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
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
        url: "/logo.png",
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
    images: ["/logo.png"],
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
        {/* Cloudflare Web Analytics */}
        <Script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"09f1ce1c2fae46a796a951a6a8edd5ee"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
