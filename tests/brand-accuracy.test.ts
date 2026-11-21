// Accuracy tests for the brand search report, run on real saved data (tests/brand-fixtures/*.json).
// Each expectation below was checked by hand against the live profiles. Run:  npm run test:brands
// Refresh the data with scripts/capture-brand-fixtures.mjs (uses Serper searches), then re-check expectations.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { buildActions, buildRows, presenceOf, type Row } from "../lib/discover/classify.ts";

type Fixture = { identity: never; brand: string; byPlatform: never; checks: { url: string }[] };
const DIR = new URL("./brand-fixtures/", import.meta.url);

function load(domain: string) {
  const fx = JSON.parse(readFileSync(new URL(`${domain}.json`, DIR), "utf8")) as Fixture;
  const checks = Object.fromEntries(fx.checks.map((c) => [c.url, c]));
  const rows: Row[] = buildRows(fx.identity, { status: "done", brand: fx.brand, byPlatform: fx.byPlatform }, fx.brand, checks as never);
  const actions = buildActions(rows, fx.brand).map((a) => a.title);
  const status = Object.fromEntries(rows.map((r) => [r.name, r.status]));
  const row = (name: string) => rows.find((r) => r.name === name)!;
  return { rows, actions, status, row };
}
const has = (list: string[], text: string) => list.some((a) => a.includes(text));

/* ---------- hand-checked answers per company ---------- */

test("openai.com: linked profiles official; Facebook, Reddit (u/OpenAI) and Threads likely", () => {
  const { status, row, actions } = load("openai.com");
  for (const p of ["YouTube", "Instagram", "LinkedIn", "X"]) assert.equal(status[p], "official", p);
  for (const p of ["Facebook", "Reddit", "Threads"]) assert.equal(status[p], "likely", p);
  assert.match(row("Reddit").bestProfile!.m.url, /reddit\.com\/user\/OpenAI/i, "official account, not the r/OpenAI fan community");
  assert.ok(has(actions, "Link your Facebook profile"));
  assert.ok(!has(actions, "doesn't show your linked"));
});

test("digifortex.com: Facebook page number + YouTube channel ID resolved; second Instagram/X accounts flagged", () => {
  const { status, row, actions } = load("digifortex.com");
  for (const p of ["YouTube", "Instagram", "Facebook", "LinkedIn", "X"]) assert.equal(status[p], "official", p);
  assert.ok(row("Facebook").tagged!.some((x) => x.t.official), "facebook.com/p/…-61564422972950 is the linked profile.php?id= page");
  assert.ok(row("YouTube").tagged!.some((x) => x.t.sameChannel), "@digifortex is the linked channel ID");
  assert.ok(!has(actions, "same channel you link to"));
  assert.ok(!has(actions, "doesn't show your linked Facebook"));
  assert.ok(has(actions, "instagram.com/digifortex_"));
  assert.ok(has(actions, "x.com/digifortex"));
});

test("effix.co.in: same-name businesses are never credited as yours", () => {
  const { status, rows } = load("effix.co.in");
  assert.equal(presenceOf(rows).confirmed, 2, "only the two linked profiles are confirmed");
  assert.equal(status.LinkedIn, "official");
  assert.equal(status.Reddit, "official");
  assert.ok(rows.every((r) => r.status !== "likely"), "nothing confirms any other Effix profile");
});

test("freshworks.com: /c/FreshworksInc and /channel/UC… are the same YouTube channel", () => {
  const { status, row, actions } = load("freshworks.com");
  assert.equal(status.YouTube, "official");
  assert.ok(row("YouTube").tagged!.some((x) => x.t.official));
  assert.ok(!has(actions, "doesn't show your linked YouTube"));
});

test("razorpay.com: every linked YouTube address counts, not just the first", () => {
  const { status, row, actions } = load("razorpay.com");
  assert.equal(status.YouTube, "official");
  assert.ok(row("YouTube").tagged!.some((x) => x.t.official));
  assert.ok(!has(actions, "doesn't show your linked YouTube"));
});

test("stripe.com: a linked video is not a profile; r/stripe stays a possible match", () => {
  const { row, status } = load("stripe.com");
  assert.doesNotMatch(row("YouTube").linked!.url, /watch\?/);
  assert.equal(status.Reddit, "possible");
});

test("notion.so and zerodha.com: Threads likely via the same handle; subreddits only possible", () => {
  const n = load("notion.so");
  assert.equal(n.status.Threads, "likely");
  assert.equal(n.status.Reddit, "possible");
  const z = load("zerodha.com");
  assert.equal(z.status.Threads, "likely");
  for (const p of ["YouTube", "Instagram", "Facebook", "LinkedIn", "X"]) assert.equal(z.status[p], "official", p);
});

test("canva.com (site blocks us): handle confirmed on one platform confirms it on others", () => {
  const { status } = load("canva.com");
  for (const p of ["Instagram", "Facebook", "LinkedIn", "X", "Threads"]) assert.equal(status[p], "likely", p);
  assert.equal(status.Reddit, "possible");
});

test("swiggy.com (no linked profiles, nothing confirmed): only possible matches, never likely", () => {
  const { rows } = load("swiggy.com");
  assert.ok(rows.every((r) => r.status === "possible" || r.status === "mentions" || r.status === "none"));
});

test("netflix.com: no linked profiles, but the exact handle on many platforms confirms them", () => {
  const { status, rows } = load("netflix.com");
  for (const p of ["Instagram", "Facebook", "LinkedIn", "X", "Threads"]) assert.equal(status[p], "likely", p);
  assert.ok(presenceOf(rows).confirmed >= 6);
});

test("youtube.com: the site's links to its own pages are not counted as profiles", () => {
  const { rows } = load("youtube.com");
  assert.ok(rows.every((r) => !r.linked), "youtube.com/about etc. are not linked profiles");
  for (const p of ["Instagram", "Facebook", "X"]) assert.equal(rows.find((r) => r.name === p)!.status, "likely", p);
});

/* ---------- rules that must hold for every company ---------- */

const ALL = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

test("all companies: a 'likely' platform always has evidence; communities are never 'likely'", () => {
  for (const d of ALL) {
    for (const r of load(d).rows.filter((x) => x.status === "likely")) {
      const t = r.bestProfile!.t;
      assert.equal(t.kind, "profile", `${d} ${r.name}`);
      assert.ok(t.mentionsSite || t.sameHandle || t.checked === "yours", `${d} ${r.name} has no evidence`);
    }
  }
});

test("all companies: results stay on their platform; Quora's own help pages aren't communities", () => {
  const host: Record<string, RegExp> = { YouTube: /youtube\.com$/, Instagram: /instagram\.com$/, Facebook: /facebook\.com$/, LinkedIn: /linkedin\.com$/, X: /(x|twitter)\.com$/, Reddit: /reddit\.com$/, Quora: /quora\.com$/, Threads: /threads\.(net|com)$/ };
  for (const d of ALL) {
    for (const r of load(d).rows) {
      for (const x of r.tagged ?? []) {
        assert.match(new URL(x.m.url).hostname, host[r.name], `${d}: ${x.m.url} on ${r.name}`);
        if (/^help\.quora\.com$/.test(new URL(x.m.url).hostname)) assert.notEqual(x.t.kind, "community");
      }
    }
  }
});

test("all companies: no duplicate to-do items, and the platform list is the eight we offer", () => {
  for (const d of ALL) {
    const { actions, rows } = load(d);
    assert.equal(new Set(actions).size, actions.length, `${d} has duplicate actions`);
    assert.deepEqual(rows.map((r) => r.name), ["YouTube", "Instagram", "Facebook", "LinkedIn", "X", "Reddit", "Quora", "Threads"]);
  }
});
