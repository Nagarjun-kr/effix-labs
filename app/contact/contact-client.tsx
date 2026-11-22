"use client";

// Interactive parts of the contact page: the "brief builder" form (chip choices, live summary, progress bar, strict
// checks, success screen) and the copy-email button. Sending and checks: lib/forms/guard.ts + rules.ts.
import { useCallback, useEffect, useRef, useState } from "react";

import { API_BASE } from "@/lib/api";
import { bindForm } from "@/lib/forms/guard";
import { checkField, type Rule } from "@/lib/forms/rules";
import AppIcon from "@/lib/discover/app-icon";

const Svg = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

const SERVICES = [
  { id: "Google Business Profile", icon: <AppIcon name="Google" size={18} /> },
  { id: "Reddit Marketing", icon: <AppIcon name="Reddit" size={18} /> },
  { id: "SEO & AEO", icon: <Svg d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3M8 11h6M11 8v6" /> },
  { id: "Content Writing", icon: <Svg d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /> },
  { id: "Website Design & Development", icon: <Svg d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" /> },
  { id: "Not sure yet", icon: <Svg d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /> },
];
const TIMING = ["As soon as possible", "Within a month", "In 1 to 3 months", "Just exploring"];

// required parts of the brief, in the order the progress bar counts them
const REQUIRED: { name: string; rule: Rule; label: string }[] = [
  { name: "interest", rule: "text", label: "What can we help with?" },
  { name: "first", rule: "name", label: "First name" },
  { name: "last", rule: "name", label: "Last name" },
  { name: "email", rule: "email", label: "Email" },
  { name: "company", rule: "company", label: "Company name" },
  { name: "heard", rule: "text", label: "How did you hear about us?" },
];

function listText(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function ContactBrief() {
  const formRef = useRef<HTMLFormElement>(null);
  const interestRef = useRef<HTMLInputElement>(null);
  const [services, setServices] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [done, setDone] = useState(0);
  const [sentTo, setSentTo] = useState<{ name: string } | null>(null);

  const recount = useCallback(() => {
    const f = formRef.current;
    if (!f) return;
    const n = REQUIRED.filter(({ name, rule, label }) => {
      const el = f.elements.namedItem(name) as HTMLInputElement | null;
      return el && el.value.trim() && !checkField({ name, rule, label, value: el.value, required: true });
    }).length;
    setDone(n);
  }, []);

  useEffect(() => {
    const f = formRef.current;
    if (!f) return;
    // remember the first name before the form resets, for the thank-you screen (registered before bindForm, whose
    // submit handler stops other handlers)
    const keep = () => { f.dataset.lastFirst = (f.elements.namedItem("first") as HTMLInputElement)?.value ?? ""; };
    f.addEventListener("submit", keep, true);
    const unbind = bindForm(f, {
      name: "Contact page",
      api: API_BASE,
      onSent: () => {
        const first = (f.dataset.lastFirst || "").trim();
        setSentTo({ name: first });
        setServices([]);
        setTiming("");
        setDone(0);
      },
    });
    f.addEventListener("input", recount);
    return () => { unbind(); f.removeEventListener("submit", keep, true); f.removeEventListener("input", recount); };
  }, [recount]);

  // chip choices live in hidden inputs; tell the checker and the progress bar when they change
  useEffect(() => {
    interestRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [services, timing]);

  const toggle = (id: string) =>
    setServices((cur) => {
      if (id === "Not sure yet") return cur.includes(id) ? [] : [id];
      const next = cur.filter((x) => x !== "Not sure yet");
      return next.includes(id) ? next.filter((x) => x !== id) : [...next, id];
    });

  const pct = Math.round((done / REQUIRED.length) * 100);
  const summary = services.length
    ? services[0] === "Not sure yet"
      ? `You're not sure yet what you need${timing ? `, ${timing.toLowerCase()}` : ""}. That's fine: we'll help you work it out.`
      : `You're asking about ${listText(services)}${timing ? `, starting ${timing === "Just exploring" ? "when you're ready (just exploring)" : timing.toLowerCase()}` : ""}.`
    : "Pick what you need and we'll tailor our reply.";

  return (
    <div className="ct-card">
      {sentTo ? (
        <div className="ct-done" role="status">
          <span className="ct-done-check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg></span>
          <h2>Thank you{sentTo.name ? `, ${sentTo.name}` : ""}.</h2>
          <p>Your brief is with the Effix Labs team. We reply within 1 business day, to the email address you gave us.</p>
          <div className="ct-done-next">
            <a href="/#audit" className="ab-btn ab-btn-dark">Run a free visibility audit <span aria-hidden="true">→</span></a>
            <a href="/blog" className="ab-btn ab-btn-ghost">Read the blog</a>
          </div>
          <button type="button" className="ct-again" onClick={() => setSentTo(null)}>Send another message</button>
        </div>
      ) : null}

      <form ref={formRef} className="ct-form" hidden={Boolean(sentTo)} aria-labelledby="ct-form-title">
        <div className="ct-card-head">
          <div>
            <h2 id="ct-form-title">Build your brief</h2>
            <p>Takes about a minute. Fields marked <b aria-hidden="true">*</b><span className="ct-sr"> with an asterisk</span> are required.</p>
          </div>
          <div className="ct-progress" role="progressbar" aria-label="Brief completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <span className="ct-progress-num">{pct}%</span>
            <span className="ct-progress-bar"><span style={{ width: `${pct}%` }} /></span>
          </div>
        </div>

        <fieldset className="ct-group">
          <legend><span className="ct-step-dot">1</span>What can we help with?<b aria-hidden="true">*</b> <small>Pick one or more</small></legend>
          <div className="ct-chips" id="ct-interest" role="group" aria-label="Services">
            {SERVICES.map((s) => {
              const on = services.includes(s.id);
              return (
                <button key={s.id} type="button" className={`ct-chip ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggle(s.id)}>
                  <span className="ct-chip-icon">{s.icon}</span>
                  <span>{s.id}</span>
                  <span className="ct-chip-tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                </button>
              );
            })}
          </div>
          <input ref={interestRef} type="hidden" name="interest" value={services.join(", ")} data-label="What can we help with?" data-focus="ct-interest" required />
        </fieldset>

        <fieldset className="ct-group">
          <legend><span className="ct-step-dot">2</span>When would you like to start? <small>Optional</small></legend>
          <div className="ct-chips is-small" role="radiogroup" aria-label="Start time">
            {TIMING.map((t) => (
              <button key={t} type="button" role="radio" aria-checked={timing === t} className={`ct-chip ${timing === t ? "is-on" : ""}`} onClick={() => setTiming(timing === t ? "" : t)}>
                <span>{t}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="timing" value={timing} data-label="When would you like to start?" />
        </fieldset>

        <p className="ct-summary" aria-live="polite"><span aria-hidden="true">✦</span> {summary}</p>

        <fieldset className="ct-group">
          <legend><span className="ct-step-dot">3</span>About you</legend>
          <div className="ct-grid">
            <label><span>First name<b aria-hidden="true">*</b></span><input name="first" required autoComplete="given-name" /></label>
            <label><span>Last name<b aria-hidden="true">*</b></span><input name="last" required autoComplete="family-name" /></label>
            <label><span>Email<b aria-hidden="true">*</b></span><input name="email" type="email" required autoComplete="email" placeholder="you@company.com" /></label>
            <label>
              <span>Phone number</span>
              <span className="bl-phone ct-phone">
                <select name="code" aria-label="Country code" defaultValue="+91">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" />
              </span>
            </label>
            <label><span>Company name<b aria-hidden="true">*</b></span><input name="company" required autoComplete="organization" /></label>
            <label><span>Company website</span><input name="website" type="text" inputMode="url" placeholder="yourbusiness.com" autoComplete="url" /></label>
            <label className="is-wide"><span>Message</span><textarea name="message" rows={4} placeholder="Tell us about your business, your customers and what you'd like help with." /></label>
            <label className="is-wide"><span>How did you hear about us?<b aria-hidden="true">*</b></span><input name="heard" required placeholder="e.g. Google search, ChatGPT, LinkedIn, Reddit, a referral" /></label>
          </div>
        </fieldset>

        <div className="ct-foot">
          <button type="submit" className="ab-btn ab-btn-dark ct-send">Send my brief <span aria-hidden="true">→</span></button>
          <p>Your message goes straight to the Effix Labs team.</p>
        </div>
        <div data-form-status hidden />
      </form>
    </div>
  );
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`ct-copy ${copied ? "is-copied" : ""}`}
      onClick={async () => {
        try { await navigator.clipboard.writeText(email); } catch { /* clipboard blocked: the mailto link still works */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
