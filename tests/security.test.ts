// Abuse-protection helpers: private-address blocking and request size caps. Run: npm run test:brands
import assert from "node:assert/strict";
import { test } from "node:test";

import { isPublicAddress, validateWebsiteUrl } from "../lib/discover/url-policy.ts";
import { readJson, TooLarge } from "../lib/read-json.ts";

test("private and reserved addresses are blocked, including IPv4-mapped IPv6", () => {
  for (const a of ["127.0.0.1", "10.0.0.5", "192.168.1.1", "172.16.0.1", "169.254.169.254", "0.0.0.0", "::1", "fd00::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:a9fe:a9fe", "::ffff:c0a8:101"]) {
    assert.equal(isPublicAddress(a), false, a);
  }
  for (const a of ["8.8.8.8", "1.1.1.1", "::ffff:808:808", "2606:4700::1111"]) assert.equal(isPublicAddress(a), true, a);
});

test("unsafe URLs are refused", () => {
  for (const u of ["file:///etc/passwd", "http://localhost/", "http://127.0.0.1/", "http://[::ffff:7f00:1]/", "http://user:pass@example.com/", "http://example.com:8080/", "ftp://example.com/"]) {
    assert.throws(() => validateWebsiteUrl(u), u);
  }
  assert.equal(validateWebsiteUrl("https://effixlabs.in/about#x").toString(), "https://effixlabs.in/about");
});

test("request bodies over the cap are refused before parsing", async () => {
  const small = new Request("https://x.test/", { method: "POST", body: JSON.stringify({ a: 1 }) });
  assert.deepEqual(await readJson(small, 100), { a: 1 });
  const big = new Request("https://x.test/", { method: "POST", body: "x".repeat(5000) });
  await assert.rejects(() => readJson(big, 1000), TooLarge);
  const bad = new Request("https://x.test/", { method: "POST", body: "{not json" });
  assert.equal(await readJson(bad, 1000), null);
});
