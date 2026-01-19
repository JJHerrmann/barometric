import { affiliateLinks, KOFI_URL } from "@/lib/affiliateLinks";
import { trackAffiliateClick } from "@/lib/analytics";

type PreparationToolsProps = {
  risk: "Low" | "Moderate" | "High";
  className?: string;
};

export default function PreparationTools({ risk, className }: PreparationToolsProps) {
  const isElevated = risk !== "Low";

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] px-4 py-3 ${className ?? ""}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="text-sm font-semibold">
        {isElevated
          ? "Preparation tools people often use during pressure changes"
          : "Preparation tools people often use"}
      </div>

      <div className="mt-2 space-y-2 text-sm">
        <a
          href={affiliateLinks.liquidIV}
          target="_blank"
          rel="nofollow noopener noreferrer"
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
          rel="nofollow noopener noreferrer"
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

      <div className="mt-2 text-xs">
        <a
          href={KOFI_URL}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="underline"
          onClick={() =>
            trackAffiliateClick({
              partner: "kofi",
              product: "support",
              asin: "n/a",
              risk,
              location: "preparation_tools",
            })
          }
        >
          Support this project on Ko-fi
        </a>
      </div>
    </div>
  );
}
