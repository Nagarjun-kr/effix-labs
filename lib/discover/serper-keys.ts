// Serper API key pool. Keys are used strictly in order (SERPER_API_KEYS="key1,key2,…", or one SERPER_API_KEY):
//  • the real balance of each key is read from Serper and counted down locally as searches run;
//  • a key is retired while it still has SERPER_RESERVE searches left (default 30, about two audits), so an audit
//    never runs out halfway; the next key takes over for the same search;
//  • balances are re-read every 10 minutes (several server instances each keep their own count);
//  • a key Serper rejects (out of credit / invalid) is set aside immediately and the search retries on the next key;
//  • alerts go to the server log and, if ALERT_WEBHOOK_URL is set (Discord, Slack, Google Chat…), to that chat:
//    when a key is used up, when fewer than SERPER_LOW_WARNING searches remain in total, and when all keys are used up.

type KeyState = { balance: number | null; checkedAt: number; retiredUntil: number; reason?: string };

const REFRESH_MS = 10 * 60 * 1000;
const state = new Map<string, KeyState>();
const alerted = new Map<string, number>(); // alert id -> last sent (ms)

const reserve = () => Math.max(0, Number(process.env.SERPER_RESERVE ?? 30) || 0);
const lowWarning = () => Math.max(0, Number(process.env.SERPER_LOW_WARNING ?? 1000) || 0);
export const maskKey = (k: string) => `ending …${k.slice(-4)}`;

export function serperKeys() {
  const raw = `${process.env.SERPER_API_KEYS ?? ""},${process.env.SERPER_API_KEY ?? ""}`;
  return [...new Set(raw.split(/[\s,;]+/).map((k) => k.trim()).filter(Boolean))];
}

const get = (key: string) => {
  let s = state.get(key);
  if (!s) state.set(key, (s = { balance: null, checkedAt: 0, retiredUntil: 0 }));
  return s;
};

/** Reads a key's remaining searches from Serper (null when Serper doesn't answer). */
export async function fetchBalance(key: string): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch("https://google.serper.dev/account", { headers: { "X-API-KEY": key }, signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (res.status === 401 || res.status === 403) return 0; // rejected key: treat as empty
    if (!res.ok) return null;
    const data = (await res.json()) as { balance?: unknown };
    return typeof data.balance === "number" ? data.balance : null;
  } catch {
    return null;
  }
}

async function alert(id: string, text: string, everyHours = 6) {
  const last = alerted.get(id) ?? 0;
  if (Date.now() - last < everyHours * 3600_000) return;
  alerted.set(id, Date.now());
  console.warn(`[serper] ${text}`);
  const hook = process.env.ALERT_WEBHOOK_URL;
  if (!hook) return;
  try {
    const msg = `Effix Discover: ${text}`;
    // "content" for Discord, "text" for Slack / Google Chat / most others
    await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: msg, text: msg }) });
  } catch {
    // alerts must never break an audit
  }
}

function remainingKnown() {
  return serperKeys().reduce((n, k) => {
    const s = get(k);
    return n + (s.retiredUntil > Date.now() ? 0 : Math.max(0, (s.balance ?? 0) - reserve()));
  }, 0);
}

function retire(key: string, why: string, hours: number) {
  const s = get(key);
  if (s.retiredUntil > Date.now()) return;
  s.retiredUntil = Date.now() + hours * 3600_000;
  s.reason = why;
  const keys = serperKeys();
  const pos = keys.indexOf(key) + 1;
  const next = keys.find((k) => get(k).retiredUntil <= Date.now());
  void alert(
    `retired:${key}`,
    `Search key ${pos} of ${keys.length} (${maskKey(key)}) ${why}. ${next ? `Switched to key ${keys.indexOf(next) + 1}.` : "No search keys left: live brand search is paused until you add a key with credit."}`,
    hours,
  );
}

/** The key to use now: the first key in order that isn't retired and has more than the reserve left. */
export async function currentKey(): Promise<string | null> {
  const now = Date.now();
  for (const key of serperKeys()) {
    const s = get(key);
    if (s.retiredUntil > now) continue;
    if (s.balance === null || now - s.checkedAt > REFRESH_MS) {
      const b = await fetchBalance(key);
      s.checkedAt = Date.now();
      if (b !== null) s.balance = b;
    }
    if (s.balance !== null && s.balance <= reserve()) {
      retire(key, s.balance <= 0 ? "is used up" : `is nearly used up (${s.balance} searches kept in reserve)`, 6);
      continue;
    }
    return key;
  }
  void alert("all-out", "All search keys are used up. Live brand search is paused until you add a key with credit (SERPER_API_KEYS).", 6);
  return null;
}

/** Call after every successful search: counts the key down and warns when the total gets low. */
export function used(key: string) {
  const s = get(key);
  if (s.balance !== null) s.balance -= 1;
  if (s.balance !== null && s.balance <= reserve()) retire(key, "is used up", 6);
  const left = remainingKnown();
  const unknown = serperKeys().some((k) => get(k).balance === null && get(k).retiredUntil <= Date.now());
  if (!unknown && left < lowWarning()) void alert("low", `About ${left} searches left across all keys (≈ ${Math.floor(left / 15)} audits). Add more keys soon.`, 24);
}

/** Serper refused the key (out of credit or invalid): set it aside so the same search moves to the next key. */
export function rejected(key: string, status: number, message: string) {
  const outOfCredit = status === 402 || /credit|balance|quota|limit exceeded|payment/i.test(message);
  if (outOfCredit) get(key).balance = 0;
  retire(key, outOfCredit ? "is used up" : `was rejected by Serper (${status})`, outOfCredit ? 6 : 24);
}

/** Status of every key, for scripts and checks. */
export async function keyReport() {
  const keys = serperKeys();
  const rows = await Promise.all(keys.map(async (k, i) => ({ n: i + 1, key: maskKey(k), balance: await fetchBalance(k) })));
  return { keys: rows, total: rows.reduce((n, r) => n + (r.balance ?? 0), 0) };
}
