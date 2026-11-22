"use client";

// Contact form shown at the end of every post. Like the service-page forms, it opens the visitor's email app with a
// message to hello@effixlabs.in filled in (no server needed).
import { useState } from "react";

const TO = "hello@effixlabs.in";

export default function ContactForm({ source }: { source: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="bl-form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) ?? "").trim();
        const body = [
          `Name: ${v("first")} ${v("last")}`,
          `Email: ${v("email")}`,
          v("phone") ? `Phone: ${v("code")} ${v("phone")}` : "",
          `Company: ${v("company")}`,
          v("website") ? `Website: ${v("website")}` : "",
          `How they heard about us: ${v("heard")}`,
          `Sent from: ${source}`,
          "",
          v("message"),
        ].filter(Boolean).join("\n");
        window.location.href = `mailto:${TO}?subject=${encodeURIComponent(`Enquiry from ${v("first")} ${v("last")} (${v("company")})`)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
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
        <label className="is-wide"><span>How did you hear about us?<b aria-hidden="true">*</b></span><input name="heard" required placeholder="e.g. Google search, ChatGPT, LinkedIn, Reddit, a referral" /></label>
      </div>
      <div className="bl-form-foot">
        <button type="submit" className="ab-btn ab-btn-dark">Send message <span aria-hidden="true">→</span></button>
        <p>{sent ? `Your email app should now be open with the message ready. If it didn't open, email ${TO}.` : `This opens your email app with the message ready to send to ${TO}.`}</p>
      </div>
    </form>
  );
}
