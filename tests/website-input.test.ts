// Every way a visitor might type their website must be understood. Run: npm run test:brands
import assert from "node:assert/strict";
import { test } from "node:test";

import { parseWebsite } from "../lib/discover/input.ts";
import { shortBrand, tidyBrandName } from "../lib/discover/brand-identity.ts";

const host = (v: string) => {
  const r = parseWebsite(v);
  return r.ok ? r.host : `ERROR: ${r.error}`;
};

test("understands common ways of typing a website", () => {
  const cases: [string, string][] = [
    ["effix.co.in", "effix.co.in"],
    ["EFFIX.CO.IN", "effix.co.in"],
    ["  effix.co.in  ", "effix.co.in"],
    ["www.effix.co.in", "www.effix.co.in"],
    ["effix.co.in/", "effix.co.in"],
    ["https://effix.co.in", "effix.co.in"],
    ["http://effix.co.in/", "effix.co.in"],
    ["https://www.netflix.com/in/", "www.netflix.com"],
    ["https://effix.co.in/services/seo?utm_source=x#top", "effix.co.in"],
    ["Https://Youtube.com", "youtube.com"],
    ["https//effix.co.in", "effix.co.in"],
    ["https:/effix.co.in", "effix.co.in"],
    ["https://https://effix.co.in", "effix.co.in"],
    ["htps://effix.co.in", "effix.co.in"],
    ["effix .co.in", "effix.co.in"],
    ["effix co in", "effix.co.in"],
    ["effix,co,in", "effix.co.in"],
    ["\"effix.co.in\"", "effix.co.in"],
    ["<https://effix.co.in>", "effix.co.in"],
    ["effix.co.in.", "effix.co.in"],
    ["hello@effix.co.in", "effix.co.in"],
    ["effix.co.in:443", "effix.co.in"],
    ["münchen.de", "xn--mnchen-3ya.de"],
  ];
  for (const [input, want] of cases) assert.equal(host(input), want, input);
});

test("keeps the exact page typed as a fallback", () => {
  const r = parseWebsite("https://www.netflix.com/in/");
  assert.ok(r.ok && r.homepage === "https://www.netflix.com/" && r.entered === "https://www.netflix.com/in/");
});

test("explains what's wrong instead of failing silently", () => {
  assert.match(host("effix"), /ending, like effix\.com/);
  assert.match(host(""), /Enter your website/);
  assert.match(host("instagram.com/digifortex_tech"), /an Instagram link/);
  assert.match(host("https://www.linkedin.com/company/digifortex/"), /a LinkedIn link/);
  assert.match(host("a b"), /doesn.t look/, "one-letter ending");
  assert.equal(host("youtube.com"), "youtube.com", "a platform's own homepage is still a website");
});

test("turns page titles into brand names", () => {
  const name = (title: string, host: string) => tidyBrandName(shortBrand(title, host));
  assert.equal(name("CRED. not everyone gets it.", "cred.club"), "CRED");
  assert.equal(name("The Tata group. Leadership with Trust.", "www.tata.com"), "Tata");
  assert.equal(name("The Body Shop", "www.thebodyshop.in"), "The Body Shop");
  assert.equal(name("Netflix India", "www.netflix.com"), "Netflix");
  assert.equal(name("Freshworks Inc", "www.freshworks.com"), "Freshworks");
  assert.equal(name("EFFIX | Turn Searches Into Clients", "effix.co.in"), "EFFIX");
  assert.equal(name("DigiFortex", "www.digifortex.com"), "DigiFortex");
});
