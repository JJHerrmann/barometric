const TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG || "";

export function amazonUrl(dp: string) {
  return `https://www.amazon.com/dp/${dp}${TAG ? `?tag=${TAG}` : ""}`;
}

export const affiliateLinks = {
  liquidIV: amazonUrl("B01IT9NLHW"),
  salud: amazonUrl("B0BKVH19HL"),
};
// lib/links.ts (or wherever you keep constants)
export const KOFI_URL = "https://ko-fi.com/mindpalacegarden";
