// lib/analytics.ts
type GtagCommand = "event" | "config" | "js" | "set" | "consent";

type GtagFn = (
  command: GtagCommand,
  target: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

type AffiliateClickPayload = {
  partner: "amazon";
  product: string;
  asin: string;
  risk?: "Low" | "Moderate" | "High";
  location?: string;
};

export function trackAffiliateClick(payload: AffiliateClickPayload) {
  window.gtag?.("event", "affiliate_click", payload);
}
