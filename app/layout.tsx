// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barometric Dashboard | Barometer.Rook.Works",
  description:
    "Track barometric pressure trends and migraine risk signals. Station-based pressure dashboard with dual units and trend/risk indicators.",
  metadataBase: new URL("https://barometer.rook.works"),
  openGraph: {
    title: "Barometric Dashboard | Barometer.Rook.Works",
    description:
      "Track barometric pressure trends and migraine risk signals. Station-based pressure dashboard with dual units and trend/risk indicators.",
    url: "https://barometer.rook.works",
    siteName: "Barometer.Rook.Works",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barometric Dashboard | Barometer.Rook.Works",
    description:
      "Track barometric pressure trends and migraine risk signals. Station-based pressure dashboard with dual units and trend/risk indicators.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-slate-100">{children}</body>
    </html>
  );
}
