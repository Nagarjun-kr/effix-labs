// Google redirect links from the search API are turned back into real addresses. Run: npm run test:brands
import assert from "node:assert/strict";
import { test } from "node:test";

import { realLink } from "../lib/discover/classify.ts";

test("rebuilds real addresses from Google redirect links", () => {
  const goto = "https://www.google.com/goto?url=CAESaAHEIkXXYzIXevpY";
  assert.equal(realLink({ link: goto, displayedLink: "https://www.youtube.com › @digifortex" }), "https://www.youtube.com/@digifortex");
  assert.equal(realLink({ link: goto, displayedLink: "in.linkedin.com › company › digifortex" }), "https://in.linkedin.com/company/digifortex");
  assert.equal(realLink({ link: goto, displayedLink: "https://www.youtube.com › watch" }), "https://www.youtube.com/watch");
  assert.equal(realLink({ link: goto, displayedLink: "https://www.instagram.com › ..." }), null, "shortened: unknown page");
  assert.equal(realLink({ link: "https://x.com/digifortex" }), "https://x.com/digifortex", "normal links stay as they are");
});
