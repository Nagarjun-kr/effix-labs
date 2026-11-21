// FAQ accordion for service pages. Every question and answer is rendered in the
// server HTML; the toggle only animates the panel height (public/js/google-business-profile/01.js).
// The same FAQ array feeds the FAQPage JSON-LD via faqPageLd(), so schema and DOM never drift.

export type FaqLink = { text: string; href: string };
export type FaqItem = { q: string; a: (string | FaqLink)[] };

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function faqText(item: FaqItem): string {
  return item.a.map((s) => (typeof s === "string" ? s : s.text)).join("");
}

export function faqPageLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: faqText(it) },
    })),
  };
}

export default function ServiceFaq({ items, idPrefix = "faq" }: { items: FaqItem[]; idPrefix?: string }) {
  return (
    <>
      {items.map((it, i) => {
        const qid = `${idPrefix}-q${i + 1}`;
        const aid = `${idPrefix}-a${i + 1}`;
        return (
          <div className="faq-item" key={qid}>
            <h3 className="faq-q-heading">
              <button type="button" className="faq-question-btn" id={qid} aria-expanded="false" aria-controls={aid} data-onclick="toggleFaq(this)">
                <span>{it.q}</span>
                <span className="faq-icon-cross" aria-hidden="true">{"+"}</span>
              </button>
            </h3>
            <div className="faq-answer-panel" id={aid} role="region" aria-labelledby={qid}>
              <p>
                {it.a.map((s, k) =>
                  typeof s === "string" ? (
                    s
                  ) : isExternal(s.href) ? (
                    <a key={k} className="rm-ext" href={s.href} target="_blank" rel="noopener noreferrer">{s.text}</a>
                  ) : (
                    <a key={k} href={s.href}>{s.text}</a>
                  )
                )}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}
