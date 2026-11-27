// Shared pricing section for all 5 service pages. Styles live in app/services/google-business-profile/gx.css.
export type PricingTier = {
  badge: string;
  name: string;
  price: string;
  unit?: string;
  summary: string;
  items: string[];
  ctaText: string;
  highlight?: boolean;
};

export default function ServicePricing({
  label = "Pricing",
  titlePlain,
  titleEm,
  lead,
  tiers,
  footnote,
  tinted = false,
}: {
  label?: string;
  titlePlain: string;
  titleEm: string;
  lead: string;
  tiers: PricingTier[];
  footnote?: string;
  tinted?: boolean;
}) {
  return (
    <section className={`gx-section${tinted ? " gx-tint" : ""}`} id="pricing">
      <div className="gx-wrap">
        <div className="gx-head">
          <span className="gx-label">{label}</span>
          <h2 className="gx-h2">
            {titlePlain}
            <em>{titleEm}</em>
          </h2>
          <p className="gx-p">{lead}</p>
        </div>
        <div className={`gx-pricing-grid${tiers.length === 1 ? " is-single" : ""}`}>
          {tiers.map((tier) => (
            <article key={tier.name} className={`gx-price-card${tier.highlight ? " is-highlight" : ""}`}>
              <span className="gx-price-badge">{tier.badge}</span>
              <h3 className="gx-price-name">{tier.name}</h3>
              <div className="gx-price-row">
                <span className="gx-price-amt">{tier.price}</span>
                {tier.unit && <span className="gx-price-unit">{tier.unit}</span>}
              </div>
              <p className="gx-price-summary">{tier.summary}</p>
              <ul className="gx-price-list">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="#contact" className="gx-price-cta">
                {tier.ctaText}
              </a>
            </article>
          ))}
        </div>
        {footnote && <p className="gx-pricing-note">{footnote}</p>}
      </div>
    </section>
  );
}
