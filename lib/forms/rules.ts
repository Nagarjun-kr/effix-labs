// Strict checks for every enquiry form on the site (blog contact form, service-page forms) and for the Worker that
// sends them (app/api/contact/route.api.ts). One set of rules, so the browser and the server always agree.
// Each check returns null when the value is fine, or { error, suggestion? } — a suggestion is a corrected value the
// visitor can apply with one click (e.g. a misspelt email domain).

export type Problem = { error: string; suggestion?: string };
export type Rule = "name" | "email" | "phone" | "company" | "website" | "message" | "text";

const FAKE_WORDS = new Set([
  "test", "testing", "tester", "test123", "asdf", "asdfg", "asdfgh", "qwerty", "qwert", "abc", "abcd", "abcde", "xyz",
  "demo", "fake", "dummy", "sample", "example", "name", "firstname", "lastname", "fullname", "user", "username", "na",
  "n/a", "none", "null", "undefined", "nil", "nothing", "no", "nope", "hello", "hi", "aaa", "xxx", "zzz", "company",
  "business", "my company", "your name", "lorem", "lorem ipsum", "foo", "bar", "foobar", "temp", "random",
]);
// placeholder values shown in the forms themselves
const PLACEHOLDERS = new Set(["sarah jenkins", "sarah@business.com", "acme labs", "98765 43210", "9876543210", "yourbusiness.com", "business.com", "https://business.com"]);

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
const isFake = (s: string) => {
  const v = norm(s);
  return FAKE_WORDS.has(v) || PLACEHOLDERS.has(v) || /^(.)\1{2,}$/.test(v.replace(/\s/g, "")) || /^(asdf|qwer|zxcv|hjkl|1234|abcd)/.test(v.replace(/\s/g, ""));
};

// ---------- names ----------
export function checkName(value: string, label = "name"): Problem | null {
  const v = value.trim();
  if (!v) return { error: `Please enter your ${label}.` };
  if (/\d/.test(v)) return { error: `Your ${label} should not contain numbers.` };
  if (!/^[\p{L}][\p{L}\p{M} .'’-]*$/u.test(v)) return { error: `Please use letters only in your ${label}.` };
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return { error: `Please enter your full ${label}.` };
  if (v.length > 60) return { error: `Your ${label} looks too long.` };
  if (isFake(v)) return { error: `Please enter your real ${label}.` };
  return null;
}

// ---------- email ----------
const POPULAR = ["gmail.com", "yahoo.com", "yahoo.co.in", "outlook.com", "hotmail.com", "icloud.com", "rediffmail.com", "live.com", "protonmail.com", "zoho.com", "aol.com"];
// real domains that sit close to a popular one and must not be "corrected"
const KNOWN_OK = new Set([...POPULAR, "mail.com", "gmx.com", "gmx.net", "ymail.com", "live.in", "outlook.in", "hotmail.co.uk", "yahoo.co.uk", "yahoo.in", "me.com", "mac.com", "proton.me", "zohomail.in", "zohomail.com", "email.com", "msn.com", "googlemail.com"]);
const TLD_FIXES: Record<string, string> = { con: "com", cmo: "com", ocm: "com", comm: "com", coom: "com", cm: "com", om: "com", vom: "com", xom: "com", "co.inn": "co.in", nett: "net", ner: "net", orgg: "org", inn: "in" };
const FAKE_DOMAINS = new Set([
  "example.com", "example.org", "example.net", "example.in", "test.com", "test.in", "test.org", "testing.com", "domain.com",
  "yourdomain.com", "mydomain.com", "company.com", "abc.com", "xyz.com", "asdf.com", "qwerty.com", "fake.com", "dummy.com",
  "sample.com", "mailinator.com", "yopmail.com", "10minutemail.com", "guerrillamail.com", "sharklasers.com", "tempmail.com",
  "temp-mail.org", "tempmail.net", "trashmail.com", "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com",
  "fakeinbox.com", "mailnesia.com", "mintemail.com", "emailondeck.com", "moakt.com", "burnermail.io", "spamgourmet.com",
]);
const FAKE_LOCAL = /^(test|testing|tester|asdf\w*|qwerty\w*|abc|abcd|xyz|demo|fake|dummy|sample|example|user|name|noreply|no-reply|null|none|aaa+|xxx+|123+|1234\w*)$/;

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

function suggestDomain(domain: string): string | null {
  if (KNOWN_OK.has(domain)) return null;
  // wrong ending: gmail.con -> gmail.com
  const dot = domain.indexOf(".");
  const tld = domain.slice(dot + 1);
  if (TLD_FIXES[tld]) return suggestDomain(domain.slice(0, dot + 1) + TLD_FIXES[tld]) ?? domain.slice(0, dot + 1) + TLD_FIXES[tld];
  // gmail.co, gmial.com, gamil.com, hotmial.com, yaho.com ...
  let best: string | null = null, bestD = 3;
  for (const p of POPULAR) {
    const dd = distance(domain, p);
    if (dd > 0 && dd < bestD) { best = p; bestD = dd; }
  }
  if (best && bestD <= (best.length > 9 ? 2 : 1)) return best;
  const name = domain.slice(0, dot);
  if (["gmail", "gmial", "gmal", "gmil", "gamil", "gnail", "gmaill"].includes(name) && domain !== "gmail.com") return "gmail.com";
  return null;
}

export function checkEmail(value: string): Problem | null {
  const v = value.trim().toLowerCase();
  if (!v) return { error: "Please enter your email address." };
  if (/\s/.test(v)) return { error: "Email addresses cannot contain spaces.", suggestion: v.replace(/\s+/g, "") };
  const at = v.lastIndexOf("@");
  if (at < 1 || v.indexOf("@") !== at) return { error: "Please enter a valid email address, like name@company.com." };
  const local = v.slice(0, at), domain = v.slice(at + 1);
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) || local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return { error: "The part before @ has characters that are not allowed in an email address." };
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(domain))
    return { error: "The part after @ is not a valid domain, like gmail.com or yourcompany.com." };
  if (v.length > 254) return { error: "That email address is too long." };
  const fix = suggestDomain(domain);
  if (fix) return { error: `Check the spelling of “${domain}”.`, suggestion: `${local}@${fix}` };
  if (FAKE_DOMAINS.has(domain) || /\.(test|example|invalid|local|localhost)$/.test(domain))
    return { error: "Please use your real email address. Test and temporary email addresses are not accepted." };
  if (FAKE_LOCAL.test(local) || PLACEHOLDERS.has(v)) return { error: "This looks like a test email. Please enter the email address you use." };
  return null;
}

// ---------- phone ----------
type Country = { digits: number[]; start: RegExp; example: string };
const COUNTRIES: Record<string, Country> = {
  "+91": { digits: [10], start: /^[6-9]/, example: "a 10-digit mobile number starting with 6, 7, 8 or 9" },
  "+1": { digits: [10], start: /^[2-9]\d{2}[2-9]/, example: "a 10-digit number (area code + number)" },
  "+44": { digits: [10], start: /^[1-9]/, example: "a 10-digit number without the leading 0" },
  "+971": { digits: [9], start: /^[1-9]/, example: "a 9-digit number without the leading 0" },
  "+61": { digits: [9], start: /^[2-478]/, example: "a 9-digit number without the leading 0" },
  "+65": { digits: [8], start: /^[3689]/, example: "an 8-digit number" },
};

export function checkPhone(value: string, code = "+91", required = false): Problem | null {
  const raw = value.trim();
  if (!raw) return required ? { error: "Please enter your phone number." } : null;
  if (/[a-z]/i.test(raw)) return { error: "Phone numbers can only contain digits." };
  if (!/^[\d\s()+-]+$/.test(raw)) return { error: "Please use digits only (spaces and dashes are fine)." };
  const d = raw.replace(/\D/g, "");
  const cc = code.replace(/\D/g, "");
  const c = COUNTRIES[code];
  // typed the country code or a leading 0 as well
  if (c && d.length > Math.max(...c.digits)) {
    if (d.startsWith(cc) && c.digits.includes(d.length - cc.length)) return { error: `No need to type ${code} again.`, suggestion: d.slice(cc.length) };
    if (d.startsWith("0") && c.digits.includes(d.length - 1)) return { error: "Leave out the leading 0.", suggestion: d.slice(1) };
  }
  if (c) {
    if (!c.digits.includes(d.length)) return { error: `Please enter ${c.example}.` };
    if (!c.start.test(d)) return { error: `That doesn't look like a valid ${code} number. Please enter ${c.example}.` };
  } else if (d.length < 6 || d.length > 15) {
    return { error: "Please enter a valid phone number." };
  }
  // obviously fake: 9999999999, 1234567890, 9876543210, 9000000000, 1212121212
  const counts = [...d].reduce<Record<string, number>>((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
  const asc = "01234567890123456789", desc = "98765432109876543210";
  if (Math.max(...Object.values(counts)) >= d.length - 2 || asc.includes(d) || desc.includes(d) || /^(\d\d)\1+$/.test(d) || /^(\d{3})\1+\d?$/.test(d) || PLACEHOLDERS.has(d))
    return { error: "This looks like a test number. Please enter the number we can reach you on." };
  return null;
}

// ---------- company, website, free text ----------
export function checkCompany(value: string): Problem | null {
  const v = value.trim();
  if (!v) return { error: "Please enter your company or brand name." };
  if (!/\p{L}/u.test(v)) return { error: "Please enter your company or brand name." };
  if (v.length < 2) return { error: "Please enter the full company name." };
  if (v.length > 100) return { error: "That company name looks too long." };
  if (isFake(v)) return { error: "Please enter your real company or brand name." };
  return null;
}

export function normaliseWebsite(value: string) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function checkWebsite(value: string, required = false): Problem | null {
  const raw = value.trim();
  if (!raw) return required ? { error: "Please enter your website." } : null;
  if (/\s/.test(raw)) return { error: "Website addresses cannot contain spaces.", suggestion: raw.replace(/\s+/g, "") };
  if (/^(?!https?:\/\/)[a-z]+:\/\//i.test(raw)) return { error: "Please enter a website address, like yourbusiness.com." };
  const host = normaliseWebsite(raw).split(/[/?#]/)[0].toLowerCase().replace(/^www\./, "");
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(host)) return { error: "Please enter a valid website, like yourbusiness.com." };
  const tld = host.slice(host.indexOf(".") + 1);
  if (TLD_FIXES[tld]) return { error: `Check the ending of “${host}”.`, suggestion: host.slice(0, host.indexOf(".") + 1) + TLD_FIXES[tld] };
  if (FAKE_DOMAINS.has(host) || PLACEHOLDERS.has(host) || /\.(test|example|invalid|local|localhost)$/.test(host)) return { error: "Please enter your real website (or leave this empty)." };
  return null;
}

export function checkText(value: string, { required = false, min = 2, label = "this field" } = {}): Problem | null {
  const v = value.trim();
  if (!v) return required ? { error: `Please fill in ${label}.` } : null;
  if (v.length < min) return { error: `Please write a little more in ${label}.` };
  if (v.length > 5000) return { error: `Please keep ${label} under 5,000 characters.` };
  if (isFake(v)) return { error: `Please write a real answer in ${label}.` };
  return null;
}

export function checkMessage(value: string, required = false): Problem | null {
  const v = value.trim();
  if (!v) return required ? { error: "Please tell us a little about what you need." } : null;
  if (v.length < 15 || v.split(/\s+/).length < 3) return { error: "Please write at least a short sentence about what you need." };
  const letters = v.replace(/[^\p{L}]/gu, "");
  const words = norm(v).split(" ");
  if (new Set(words).size < 3 || words.every((w) => FAKE_WORDS.has(w))) return { error: "Please write a real message so we can help you." };
  if (letters.length < 10 || !/[aeiouy]/i.test(letters) || /(.)\1{5,}/.test(v) || isFake(v)) return { error: "Please write a real message so we can help you." };
  if (v.length > 5000) return { error: "Please keep your message under 5,000 characters." };
  return null;
}

// ---------- whole submission (used by the Worker) ----------
export type Submission = { form: string; page: string; fields: { name: string; label: string; rule: Rule; value: string; required: boolean; code?: string }[] };

export function checkField(f: Submission["fields"][number]): Problem | null {
  switch (f.rule) {
    case "name": return checkName(f.value, f.label.toLowerCase().includes("last") ? "last name" : f.label.toLowerCase().includes("first") ? "first name" : "name");
    case "email": return checkEmail(f.value);
    case "phone": return checkPhone(f.value, f.code, f.required);
    case "company": return checkCompany(f.value);
    case "website": return checkWebsite(f.value, f.required);
    case "message": return checkMessage(f.value, f.required);
    default: return checkText(f.value, { required: f.required, label: `“${f.label}”` });
  }
}
