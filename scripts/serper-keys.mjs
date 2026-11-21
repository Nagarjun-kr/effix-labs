// Shows how many searches each Serper key has left (keys are read from .env / .env.local and shown masked).
// Usage: node scripts/serper-keys.mjs
import { existsSync, readFileSync } from "node:fs";

const vars = {};
for (const f of [".env", ".env.local"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(SERPER_API_KEYS?)\s*=\s*(.*)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const keys = [...new Set(`${process.env.SERPER_API_KEYS ?? vars.SERPER_API_KEYS ?? ""},${process.env.SERPER_API_KEY ?? vars.SERPER_API_KEY ?? ""}`.split(/[\s,;]+/).filter(Boolean))];
if (!keys.length) {
  console.log("No Serper keys found. Add SERPER_API_KEYS=key1,key2 to .env");
  process.exit(1);
}
let total = 0;
for (const [i, k] of keys.entries()) {
  const res = await fetch("https://google.serper.dev/account", { headers: { "X-API-KEY": k } }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const left = typeof data?.balance === "number" ? data.balance : null;
  if (left !== null) total += left;
  console.log(`${i + 1}. key ending …${k.slice(-4)}  ${left === null ? `not working (${res?.status ?? "no answer"})` : `${left.toLocaleString("en-IN")} searches left`}`);
}
console.log(`Total: ${total.toLocaleString("en-IN")} searches ≈ ${Math.floor(total / 15).toLocaleString("en-IN")} audits (about 15 searches each). Keys are used in this order.`);
