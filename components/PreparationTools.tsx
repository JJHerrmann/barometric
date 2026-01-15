import { affiliateLinks } from "@/lib/affiliateLinks";
import { trackAffiliateClick } from "@/lib/analytics";

type PreparationToolsProps = {
  risk: "Low" | "Moderate" | "High";
};

export default function PreparationTools({ risk }: PreparationToolsProps) {
  const isElevated = risk !== "Low";

  return (
    <div
      className="rounded-2xl border px-4 py-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="text-sm font-semibold">Preparation tools people often use</div>

      <div className="mt-2 space-y-2 text-sm">
        <a
          href={affiliateLinks.liquidIV}
          target="_blank"
          rel="nofollow noopener"
          className="block underline"
          onClick={() =>
            trackAffiliateClick({
              partner: "amazon",
              product: "liquid_iv",
              asin: "B01IT9NLHW",
              risk,
              location: "preparation_tools",
            })
          }
        >
          Liquid I.V. Hydration Multiplier
        </a>

        <a
          href={affiliateLinks.salud}
          target="_blank"
          rel="nofollow noopener"
          className="block underline"
          onClick={() =>
            trackAffiliateClick({
              partner: "amazon",
              product: "salud",
              asin: "B0BKVH19HL",
              risk,
              location: "preparation_tools",
            })
          }
        >
          SALUD Electrolyte Drink
        </a>
      </div>

      <div className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
        Affiliate links. We may earn a commission from qualifying purchases. No medical claims.
      </div>
    </div>
  );
}
