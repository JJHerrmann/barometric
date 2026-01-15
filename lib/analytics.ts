// lib/analytics.ts
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
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
  // Safe no-op if GA isn't loaded or blocked
  window.gtag?.("event", "affiliate_click", payload);
}
