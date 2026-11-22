// Strict checking and sending for any enquiry form on the site. Attach with bindForm(form, { name, api }).
// - Checks each field when the visitor leaves it and again on submit, using lib/forms/rules.ts.
// - Shows the problem under the field; a likely typo comes with a one-click fix ("Did you mean …?").
// - Sends the form to the Worker (/api/contact), which emails it to the Effix inbox.
// Hidden inputs with data-label (values picked with chip buttons) are checked too; data-focus names the element to
// focus when they are invalid.
// Field rules come from data-rule="name|email|phone|company|website|message|text" or are inferred from the field name.
import { checkField, type Rule, type Submission } from "./rules";

const STYLE = `
.fx-err{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline;margin:6px 2px 0;font:500 13px/1.45 'Plus Jakarta Sans',system-ui,sans-serif;color:#c0392b;text-align:left}
.fx-err[hidden]{display:none}
.fx-err button{all:unset;cursor:pointer;color:#5638d6;font-weight:600;text-decoration:underline;text-underline-offset:2px}
.fx-err button:focus-visible{outline:2px solid #7c5cf0;outline-offset:2px;border-radius:3px}
[aria-invalid="true"]{border-color:#e0675a !important;box-shadow:0 0 0 3px rgba(224,103,90,.14) !important}
.fx-hp{position:absolute !important;left:-9999px !important;width:1px;height:1px;overflow:hidden}
.fx-status{margin-top:12px;padding:12px 14px;border-radius:10px;font:500 14px/1.5 'Plus Jakarta Sans',system-ui,sans-serif;text-align:left}
.fx-status[hidden]{display:none}
.fx-status.is-ok{background:#f1faea;border:1px solid #cfe9b8;color:#2f5d16}
.fx-status.is-bad{background:#fdf0ee;border:1px solid #f3c9c2;color:#9b2c1f}

.fx-status .fx-mail{display:inline-flex;margin-top:10px;padding:9px 16px;border-radius:999px;background:#151515;color:#fff !important;font:600 13.5px 'Plus Jakarta Sans',system-ui,sans-serif;text-decoration:none !important}
.fx-status .fx-mail:hover{background:#000}
.fx-status.is-wait{background:#f4f1fd;border:1px solid #dcd3fa;color:#4a3fb5}
`;

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
// where the "Send by email instead" fallback goes (same inbox as the Worker uses)
const FALLBACK_TO = "effix.labs@gmail.com";
const FIELD_RULES: Record<string, Rule> = {
  first: "name", last: "name", fullname: "name", name: "name", firstname: "name", lastname: "name",
  email: "email", workemail: "email",
  phone: "phone", mobile: "phone", tel: "phone",
  company: "company", businessname: "company", brand: "company",
  website: "website", websiteurl: "website", url: "website",
  message: "message", details: "message",
};

function ruleOf(el: Field): Rule {
  const explicit = el.dataset.rule as Rule | undefined;
  if (explicit) return explicit;
  const key = (el.name || el.id).toLowerCase().replace(/[^a-z]/g, "");
  if (FIELD_RULES[key]) return FIELD_RULES[key];
  if (el instanceof HTMLInputElement) {
    if (el.type === "email") return "email";
    if (el.type === "tel") return "phone";
    if (el.type === "url") return "website";
  }
  return "text";
}

function labelOf(el: Field) {
  if (el.dataset.label) return el.dataset.label;
  const lab = (el.id && el.form?.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`)) || el.closest("label");
  const text = lab ? (lab.querySelector("span")?.textContent ?? lab.textContent ?? "") : el.getAttribute("aria-label") || el.name;
  return text.replace(/\*/g, "").replace(/\s+/g, " ").trim() || el.name;
}

export function bindForm(form: HTMLFormElement, opts: { name: string; api: string; onSent?: () => void }) {
  if (form.dataset.fxBound) return () => {};
  form.dataset.fxBound = "1";
  form.noValidate = true; // our messages replace the browser's
  if (!document.getElementById("fx-style")) {
    const s = document.createElement("style");
    s.id = "fx-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }
  const started = Date.now();

  // honeypot: bots fill it, people never see it
  const hp = document.createElement("input");
  hp.type = "text"; hp.name = "_hp"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.className = "fx-hp"; hp.setAttribute("aria-hidden", "true");
  form.appendChild(hp);

  const fields = [...form.querySelectorAll<Field>("input, textarea, select")].filter(
    (el) =>
      el !== hp && el.name !== "code" &&
      // hidden inputs take part only when they carry a label (e.g. values chosen with chip buttons)
      ((el as HTMLInputElement).type === "hidden" ? Boolean(el.dataset.label) : !["submit", "button", "checkbox", "radio"].includes((el as HTMLInputElement).type)),
  );
  const codeEl = form.querySelector<HTMLSelectElement>('select[name="code"]');
  const touched = new Set<Field>();

  const errBox = (el: Field) => {
    let box = (el as Field & { _fx?: HTMLElement })._fx;
    if (!box) {
      box = document.createElement("div");
      box.className = "fx-err";
      box.id = `fx-${el.name || el.id}-${Math.random().toString(36).slice(2, 7)}`;
      box.setAttribute("aria-live", "polite");
      box.hidden = true;
      const anchor = el.closest(".bl-phone") ?? el;
      anchor.insertAdjacentElement("afterend", box);
      (el as Field & { _fx?: HTMLElement })._fx = box;
      el.setAttribute("aria-describedby", [el.getAttribute("aria-describedby"), box.id].filter(Boolean).join(" "));
    }
    return box;
  };

  const entry = (el: Field) => ({ name: el.name || el.id, label: labelOf(el), rule: ruleOf(el), value: el.value, required: el.required, code: ruleOf(el) === "phone" ? codeEl?.value : undefined });

  const check = (el: Field) => {
    const problem = el instanceof HTMLSelectElement ? (el.required && !el.value ? { error: `Please choose an option for “${labelOf(el)}”.` } : null) : checkField(entry(el));
    const box = errBox(el);
    box.replaceChildren();
    if (!problem) { box.hidden = true; el.removeAttribute("aria-invalid"); return true; }
    el.setAttribute("aria-invalid", "true");
    box.append(document.createTextNode(problem.error));
    if (problem.suggestion) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = `Use ${problem.suggestion}`;
      b.addEventListener("click", () => { el.value = problem.suggestion!; check(el); el.focus(); });
      box.append(document.createTextNode(" "), b);
    }
    box.hidden = false;
    return false;
  };

  const onBlur = (e: Event) => { const el = e.target as Field; if (fields.includes(el) && el.value.trim()) { touched.add(el); check(el); } };
  const onInput = (e: Event) => { const el = e.target as Field; if (touched.has(el)) check(el); };
  const onCode = () => { const ph = fields.find((f) => ruleOf(f) === "phone"); if (ph && ph.value.trim()) check(ph); };
  form.addEventListener("focusout", onBlur);
  form.addEventListener("input", onInput);
  codeEl?.addEventListener("change", onCode);

  let status = form.querySelector<HTMLElement>("[data-form-status], #formFeedback");
  const say = (kind: "ok" | "bad" | "wait", text: string, mailto?: string) => {
    if (!status) {
      status = document.createElement("div");
      form.appendChild(status);
    }
    status.removeAttribute("style");
    status.className = `fx-status is-${kind}`;
    status.setAttribute("role", kind === "bad" ? "alert" : "status");
    status.textContent = text;
    if (mailto) {
      const link = document.createElement("a");
      link.className = "fx-mail";
      link.href = mailto;
      link.textContent = "Send by email instead →";
      status.append(document.createElement("br"), link);
    }
    status.hidden = false;
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    fields.forEach((f) => touched.add(f));
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      const first = bad[0];
      if ((first as HTMLInputElement).type === "hidden") {
        const group = first.dataset.focus ? document.getElementById(first.dataset.focus) : null;
        group?.querySelector<HTMLElement>("button, input")?.focus();
        (group ?? errBox(first)).scrollIntoView({ block: "center", behavior: "smooth" });
      } else first.focus();
      say("bad", bad.length === 1 ? "Please fix the highlighted field." : `Please fix the ${bad.length} highlighted fields.`);
      return;
    }
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])');
    const label = button?.innerHTML;
    if (button) { button.disabled = true; button.textContent = "Sending…"; }
    say("wait", "Sending your message…");
    const payload: Submission & { hp: string; t: number } = {
      form: opts.name,
      page: location.pathname,
      fields: fields.map(entry).map((f) => (f.rule === "phone" && f.value.trim() ? { ...f, code: codeEl?.value ?? "+91" } : f)),
      hp: hp.value,
      t: Date.now() - started,
    };
    // safety net: if sending fails, the visitor can send the same details from their email app in one click
    const mailto = () => {
      const lines = payload.fields.filter((f) => f.value.trim()).map((f) => `${f.label}: ${f.rule === "phone" && f.code ? `${f.code} ` : ""}${f.value.trim()}`);
      const who = payload.fields.filter((f) => f.rule === "name").map((f) => f.value.trim()).join(" ");
      return `mailto:${FALLBACK_TO}?subject=${encodeURIComponent(`Enquiry (${opts.name})${who ? `: ${who}` : ""}`)}&body=${encodeURIComponent(`${lines.join("\n")}\n\nSent from effixlabs.in${location.pathname}`)}`;
    };
    try {
      const res = await fetch(`${opts.api}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: string };
      if (res.ok && data.ok) {
        form.reset();
        touched.clear();
        fields.forEach((f) => { f.removeAttribute("aria-invalid"); errBox(f).hidden = true; });
        say("ok", "Thank you! Your message has reached the Effix Labs team. We will reply to the email address you gave us.");
        opts.onSent?.();
      } else {
        const el = data.field ? fields.find((f) => (f.name || f.id) === data.field) : undefined;
        if (el) { check(el); el.focus(); }
        // a field problem is fixable in the form; anything else (server not set up, provider down) gets the email fallback
        say("bad", data.error || "Sorry, your message could not be sent right now.", el ? undefined : mailto());
      }
    } catch {
      say("bad", "Sorry, we couldn't reach our server just now. You can send the same details by email instead.", mailto());
    } finally {
      if (button) { button.disabled = false; button.innerHTML = label ?? "Send"; }
    }
  };
  form.addEventListener("submit", onSubmit, true);

  return () => {
    form.removeEventListener("focusout", onBlur);
    form.removeEventListener("input", onInput);
    form.removeEventListener("submit", onSubmit, true);
    codeEl?.removeEventListener("change", onCode);
    hp.remove();
    delete form.dataset.fxBound;
  };
}
