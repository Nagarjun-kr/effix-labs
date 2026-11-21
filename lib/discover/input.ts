// Turns whatever a visitor types into a website address we can check. Pure (no Node APIs): used by the page and the API.
//   "EFFIX.CO.IN", "www.effix.co.in/", "https://effix.co.in/a?utm=x", "https//effix.co.in", "effix .co.in",
//   "effix co in", "hello@effix.co.in", "\"effix.co.in\""  ->  host "effix.co.in"

export type ParsedWebsite =
  | { ok: true; host: string; homepage: string; entered: string }
  | { ok: false; error: string };

// Social/hosting platforms: a link to them is a profile, not the visitor's own website.
const PLATFORM_HOSTS = ["instagram.com", "facebook.com", "fb.com", "linkedin.com", "x.com", "twitter.com", "youtube.com", "youtu.be", "tiktok.com", "reddit.com", "quora.com", "threads.net", "threads.com", "pinterest.com", "wa.me", "whatsapp.com", "t.me", "linktr.ee"];

const PLATFORM_NAMES: Record<string, string> = { "instagram.com": "Instagram", "facebook.com": "Facebook", "fb.com": "Facebook", "linkedin.com": "LinkedIn", "x.com": "X", "twitter.com": "X", "youtube.com": "YouTube", "youtu.be": "YouTube", "tiktok.com": "TikTok", "reddit.com": "Reddit", "quora.com": "Quora", "threads.net": "Threads", "threads.com": "Threads", "pinterest.com": "Pinterest", "wa.me": "WhatsApp", "whatsapp.com": "WhatsApp", "t.me": "Telegram", "linktr.ee": "Linktree" };

const SCHEME_JUNK = /^\s*(?:h\s*t\s*t\s*p\s*s?|hxxps?|htps?|htp|ttps?)?\s*[:;]?\s*[/\\]+/i;

export function parseWebsite(raw: unknown): ParsedWebsite {
  if (typeof raw !== "string") return { ok: false, error: "Enter your website address, like yourbusiness.com." };
  let v = raw.trim().replace(/^[\s"'“”‘’<(\[]+|[\s"'“”‘’>)\].,;:!?]+$/g, "");
  if (!v) return { ok: false, error: "Enter your website address, like yourbusiness.com." };
  if (v.length > 2048) return { ok: false, error: "That address is too long. Enter just your website, like yourbusiness.com." };

  // Email address -> its domain
  const email = v.match(/^[^\s@/]+@([^\s@/]+\.[^\s@/]+)$/);
  if (email) v = email[1];

  // Remove any scheme, including typos and repeats ("https//", "https:/", "https://https://")
  for (let i = 0; i < 3; i++) {
    const next = v.replace(/^[a-z][a-z\d+.-]*:\/\//i, "").replace(SCHEME_JUNK, "");
    if (next === v) break;
    v = next;
  }

  // Split host from path; tidy spaces/commas typed instead of dots
  let [host, ...rest] = v.split(/(?=[/?#])/);
  const path = rest.join("");
  host = host.trim();
  if (!host.includes(".") && /[\s,]/.test(host)) host = host.replace(/[\s,]+/g, ".");
  host = host.replace(/\s+/g, "").replace(/,/g, ".").replace(/\.{2,}/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase();
  host = host.replace(/^[^@]*@/, ""); // user@host
  host = host.replace(/:(80|443)$/, ""); // default ports

  if (!host) return { ok: false, error: "Enter your website address, like yourbusiness.com." };
  if (!host.includes(".")) return { ok: false, error: `Add your website's ending, like ${host}.com or ${host}.in.` };

  let url: URL;
  try {
    url = new URL(`https://${host}/`);
  } catch {
    return { ok: false, error: "That doesn't look like a website address. Try something like yourbusiness.com." };
  }
  const h = url.hostname; // punycode for international names
  const tld = h.split(".").pop() ?? "";
  if (!/^([a-z]{2,63}|xn--[a-z0-9-]{2,59})$/.test(tld)) return { ok: false, error: "That doesn't look like a website address. Try something like yourbusiness.com." };

  const bare = h.replace(/^www\./, "");
  const pathPart = path.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
  if (PLATFORM_HOSTS.some((p) => bare === p || bare.endsWith(`.${p}`)) && pathPart.length > 0) {
    const host = PLATFORM_HOSTS.find((p) => bare === p || bare.endsWith(`.${p}`)) ?? "";
    const name = PLATFORM_NAMES[host] ?? host;
    return { ok: false, error: `That's ${/^[AEIOU]/.test(name) ? "an" : "a"} ${name} link. Enter your own website instead, like yourbusiness.com, and we'll find your ${name} profile for you.` };
  }

  let entered = `https://${h}/`;
  try {
    entered = new URL(`https://${h}${path || "/"}`).toString();
  } catch {}
  return { ok: true, host: h, homepage: `https://${h}/`, entered };
}

/** Short form for showing in the page and the address bar ("effix.co.in"). */
export const displayHost = (host: string) => host.replace(/^www\./, "");
