// Saves real brand-search data (website profiles, search results, profile checks) for the accuracy tests.
// Usage: start the dev server, then  node scripts/capture-brand-fixtures.mjs openai.com stripe.com …
// Uses Serper searches for brands not searched in the last hour. Output: tests/brand-fixtures/<domain>.json
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const post = async (path, body) => {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.status !== 429) return res.json();
    await sleep(15000); // rate limit: wait and retry
  }
  throw new Error(`rate limited: ${path}`);
};

mkdirSync("tests/brand-fixtures", { recursive: true });
const { checkTargets } = await import("../lib/discover/classify.ts");
for (const domain of process.argv.slice(2)) {
  const { identity, error } = await post("/api/discovery", { url: domain });
  if (!identity) { console.log(domain, "failed:", error); continue; }
  const m = await post("/api/discovery/mentions", { brand: identity.name, domain: identity.domain });
  if (!m.platforms) { console.log(domain, "search failed:", m.error); continue; }
  const byPlatform = Object.fromEntries(m.platforms.map((p) => [p.platform, p]));
  const mentions = { status: "done", brand: identity.name, byPlatform, overview: m.overview };
  const items = checkTargets(identity, mentions, identity.name);
  const checks = items.length ? (await post("/api/discovery/verify", { domain: identity.domain, items })).checks ?? [] : [];
  writeFileSync(`tests/brand-fixtures/${domain}.json`, JSON.stringify({ capturedAt: new Date().toISOString(), identity, brand: identity.name, byPlatform, overview: m.overview, searches: m.searches, checks }, null, 1));
  console.log(domain, "→", identity.name, "| profiles", identity.profiles.length, "| errors", m.platforms.filter((p) => p.error).length, "| checks", checks.length, "| searches", m.searches, "| site in Google top 10:", m.overview?.siteFound);
  await sleep(1500);
}
