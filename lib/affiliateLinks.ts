const TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOC_TAG || "";

export function amazonUrl(dp: string) {
  return `https://www.amazon.com/dp/${dp}${TAG ? `?tag=${TAG}` : ""}`;
}

export const affiliateLinks = {
  liquidIV: amazonUrl("B01IT9NLHW"),
  salud: amazonUrl("B09XXXXX"),
};
