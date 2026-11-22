"use client";

// Contact form shown at the end of every post. Fields are checked strictly (lib/forms/guard.ts + rules.ts) and the
// message is sent through the Worker (/api/contact) to the Effix inbox.
import { useEffect, useRef } from "react";

import { API_BASE } from "@/lib/api";
import { bindForm } from "@/lib/forms/guard";

export default function ContactForm({ source }: { source: string }) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => (ref.current ? bindForm(ref.current, { name: `Blog: ${source}`.slice(0, 60), api: API_BASE }) : undefined), [source]);

  return (
    <form className="bl-form" ref={ref}>
      <div className="bl-form-grid">
        <label><span>First name<b aria-hidden="true">*</b></span><input name="first" required autoComplete="given-name" /></label>
        <label><span>Last name<b aria-hidden="true">*</b></span><input name="last" required autoComplete="family-name" /></label>
        <label><span>Email<b aria-hidden="true">*</b></span><input name="email" type="email" required autoComplete="email" /></label>
        <label>
          <span>Phone number</span>
          <span className="bl-phone">
            <select name="code" aria-label="Country code" defaultValue="+91">
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+65">🇸🇬 +65</option>
            </select>
            <input name="phone" type="tel" inputMode="tel" placeholder="98765 43210" autoComplete="tel-national" />
          </span>
        </label>
        <label><span>Company name<b aria-hidden="true">*</b></span><input name="company" required autoComplete="organization" /></label>
        <label><span>Company website</span><input name="website" type="text" inputMode="url" placeholder="yourbusiness.com" autoComplete="url" /></label>
        <label className="is-wide"><span>Message</span><textarea name="message" rows={5} placeholder="Tell us about your business and what you'd like help with." /></label>
        <label className="is-wide"><span>How did you hear about us?</span><input name="heard" placeholder="e.g. Google search, ChatGPT, LinkedIn, Reddit, a referral" /></label>
      </div>
      <div className="bl-form-foot">
        <button type="submit" className="ab-btn ab-btn-dark">Send message <span aria-hidden="true">→</span></button>
        <p>Your message goes straight to the Effix Labs team.</p>
      </div>
      <div data-form-status hidden />
    </form>
  );
}
