// Enquiry forms (blog contact form, service-page forms) post here. The fields are checked again with the same strict
// rules the browser uses (lib/forms/rules.ts), then emailed to the Effix inbox through Resend (resend.com).
// Settings (Worker secrets / .env):
//   RESEND_API_KEY  required; from resend.com → API Keys
//   CONTACT_TO      where enquiries go (default effix.labs@gmail.com)
//   CONTACT_FROM    sender (default "Effix Labs <onboarding@resend.dev>", which Resend only delivers to the email that
//                   owns the Resend account; after verifying effixlabs.in in Resend use e.g. "Effix Labs <forms@effixlabs.in>")
import { allow } from "@/lib/rate-limit";
import { checkField, type Rule, type Submission } from "@/lib/forms/rules";

export const runtime = "nodejs";

const RULES: Rule[] = ["name", "email", "phone", "company", "website", "message", "text"];
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const fail = (error: string, status = 400, field?: string) => Response.json({ ok: false, error, field }, { status, headers });
  if (!allow(request, "contact", 5, 10 * 60_000)) return fail("You have sent several messages in a short time. Please wait a few minutes and try again.", 429);

  const body = (await request.json().catch(() => null)) as (Partial<Submission> & { hp?: unknown; t?: unknown }) | null;
  if (!body || !Array.isArray(body.fields)) return fail("Something went wrong with the form. Please reload the page and try again.");
  // bots: filled the hidden field or submitted in under 2 seconds. Pretend it worked.
  if (str(body.hp, 200) || (typeof body.t === "number" && body.t < 2000)) return Response.json({ ok: true }, { headers });

  const fields = body.fields.slice(0, 20).map((f) => ({
    name: str(f?.name, 60),
    label: str(f?.label, 80) || str(f?.name, 60),
    rule: (RULES.includes(f?.rule as Rule) ? f.rule : "text") as Rule,
    value: str(f?.value, 5000).trim(),
    required: Boolean(f?.required),
    code: str(f?.code, 6) || undefined,
  }));
  const email = fields.find((f) => f.rule === "email");
  if (!email) return fail("Please enter your email address.");
  for (const f of fields) {
    const problem = checkField({ ...f, required: f.required || f.rule === "email" });
    if (problem) return fail(problem.error, 400, f.name);
  }

  const { RESEND_API_KEY: key, CONTACT_TO: to = "effix.labs@gmail.com", CONTACT_FROM: from = "Effix Labs <onboarding@resend.dev>" } = process.env;
  if (!key) return fail("Our form can't send messages right now.", 503);

  const form = str(body.form, 60) || "Website form";
  const page = str(body.page, 200) || "/";
  const name = fields.filter((f) => f.rule === "name").map((f) => f.value).join(" ") || email.value;
  const company = fields.find((f) => f.rule === "company")?.value;
  const rows = fields.filter((f) => f.value).map((f) => ({ label: f.label, value: f.rule === "phone" && f.code ? `${f.code} ${f.value}` : f.value }));
  const subject = `New enquiry (${form}): ${name}${company ? `, ${company}` : ""}`;
  const html = `<div style="font:15px/1.55 system-ui,sans-serif;color:#151515;max-width:640px">
<h2 style="margin:0 0 4px;font-size:18px">New enquiry from the ${esc(form)} form</h2>
<p style="margin:0 0 16px;color:#5f5b6e">Sent from effixlabs.in${esc(page)}. Reply to this email to answer ${esc(name)} directly.</p>
<table style="border-collapse:collapse;width:100%">${rows
    .map((r) => `<tr><td style="padding:8px 12px;border:1px solid #ecebf2;background:#f7f6fb;font-weight:600;vertical-align:top;white-space:nowrap">${esc(r.label)}</td><td style="padding:8px 12px;border:1px solid #ecebf2;white-space:pre-wrap">${esc(r.value)}</td></tr>`)
    .join("")}</table></div>`;
  const text = [`New enquiry from the ${form} form (effixlabs.in${page})`, "", ...rows.map((r) => `${r.label}: ${r.value}`)].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()).filter(Boolean), reply_to: email.value.toLowerCase(), subject, html, text }),
  }).catch(() => null);
  if (!res || !res.ok) {
    console.error("contact: resend failed", res?.status, await res?.text().catch(() => ""));
    return fail("Sorry, your message could not be sent right now.", 502);
  }
  return Response.json({ ok: true }, { headers });
}
