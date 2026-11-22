// Cloudflare Turnstile in the browser (bot check for the enquiry forms and the audit tools).
// To switch it on: create a Turnstile widget in the Cloudflare dashboard for effixlabs.in (widget mode: "Invisible"
// or "Managed"), paste its public SITE KEY below, and set its secret on the Worker:
//   npx wrangler secret put TURNSTILE_SECRET
// While the site key is empty, getHumanToken() returns undefined and nothing is loaded.
export const TURNSTILE_SITE_KEY = "";

type Turnstile = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

let loading: Promise<Turnstile | undefined> | undefined;

function load(): Promise<Turnstile | undefined> {
  const w = window as unknown as { turnstile?: Turnstile };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  loading ??= new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve((window as unknown as { turnstile?: Turnstile }).turnstile);
    s.onerror = () => resolve(undefined);
    document.head.appendChild(s);
  });
  return loading;
}

/** Gets a fresh one-time Turnstile token. Shows a small check in the corner only if Cloudflare needs one. */
export async function getHumanToken(): Promise<string | undefined> {
  if (!TURNSTILE_SITE_KEY || typeof window === "undefined") return undefined;
  const ts = await load();
  if (!ts) return undefined;
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483000";
  document.body.appendChild(box);
  return new Promise((resolve) => {
    let id = "";
    const done = (token?: string) => {
      try { if (id) ts.remove(id); } catch { /* ignore */ }
      box.remove();
      resolve(token);
    };
    const timer = setTimeout(() => done(undefined), 30_000);
    id = ts.render(box, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      callback: (token: string) => { clearTimeout(timer); done(token); },
      "error-callback": () => { clearTimeout(timer); done(undefined); },
    });
  });
}
