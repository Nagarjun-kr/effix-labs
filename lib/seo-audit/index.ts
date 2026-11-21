// Runs the full Effix SEO audit for one website.
import { extractBrandIdentity } from "@/lib/discover/brand-identity";
import { retrieveSafely } from "@/lib/discover/safe-retrieval";
import { writeInsights } from "./ai";
import { runChecks, scoreChecks } from "./checks";
import { parsePage } from "./parse";
import { auditSite } from "./site";
import type { AuditReport } from "./types";

export async function runAudit(url: URL): Promise<AuditReport> {
  const res = await retrieveSafely(url, "html");
  const page = parsePage(res);
  const home = new URL(res.url);
  const host = home.hostname.replace(/^www\./, "");
  const { site, pages } = await auditSite(home, page.internalLinks);
  const checks = runChecks(page, site, pages);
  const scores = scoreChecks(checks);
  const ai = await writeInsights(host, checks, scores);
  return {
    url: res.url,
    host,
    auditedAt: new Date().toISOString(),
    page: { ...page, internalLinks: page.internalLinks.slice(0, 60) },
    site,
    pages,
    checks,
    scores,
    identity: extractBrandIdentity(res.body, res.url),
    ai,
  };
}
