// Optional AI write-up. Uses Groq when GROQ_API_KEY is set; otherwise a plain summary built from the checks.
import type { AiInsights, Check } from "./types";

const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function fallback(host: string, checks: Check[], scores: Record<string, number>): AiInsights {
  const failed = checks.filter((c) => !c.passed);
  const high = failed.filter((c) => c.severity === "high");
  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
  const area = { technical: "technical SEO", content: "on-page content", ai: "AI visibility" }[weakest[0]] ?? weakest[0];
  const summary = failed.length
    ? `${host} passed ${checks.length - failed.length} of ${checks.length} checks. ` +
      (high.length
        ? `Start with the ${high.length === 1 ? "high-priority issue" : `${high.length} high-priority issues`}: ${high.slice(0, 3).map((c) => c.title.toLowerCase()).join("; ")}. `
        : "There are no high-priority problems. ") +
      `The weakest area is ${area} (${weakest[1]}/100), so fixing those items will move the score most.`
    : `${host} passed all ${checks.length} checks. Keep titles, schema and content up to date as the site grows.`;
  return { generated: false, summary, fixes: {} };
}

export async function writeInsights(host: string, checks: Check[], scores: Record<string, number>): Promise<AiInsights> {
  const base = fallback(host, checks, scores);
  const key = process.env.GROQ_API_KEY;
  const failed = checks.filter((c) => !c.passed).slice(0, 10);
  if (!key || failed.length === 0) return base;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You are a senior SEO consultant writing for a business owner. Plain English, short sentences, no hype, no markdown. Only use the facts given; never invent numbers. Return JSON: {"summary": string (2-3 sentences: overall state and the 2-3 things to do first), "fixes": {"<code>": string (one or two practical sentences tailored to the evidence)}}.',
          },
          {
            role: "user",
            content: JSON.stringify({
              site: host,
              scores,
              issues: failed.map((c) => ({ code: c.code, severity: c.severity, issue: c.title, evidence: c.evidence })),
            }),
          },
        ],
      }),
    });
    if (!res.ok) return base;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { summary?: unknown; fixes?: unknown };
    const fixes: Record<string, string> = {};
    if (parsed.fixes && typeof parsed.fixes === "object") {
      for (const [k, v] of Object.entries(parsed.fixes as Record<string, unknown>)) {
        if (typeof v === "string" && failed.some((c) => c.code === k)) fixes[k] = v.slice(0, 600);
      }
    }
    return {
      generated: true,
      summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.slice(0, 900) : base.summary,
      fixes,
    };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
  }
}
