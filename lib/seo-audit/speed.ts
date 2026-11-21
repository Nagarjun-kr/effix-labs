// Real speed data from Google PageSpeed Insights (Lighthouse lab test + Chrome real-user data when Google has it).
import type { SpeedReport } from "./types";

type Audit = { title?: string; score?: number | null; displayValue?: string; details?: { type?: string; overallSavingsMs?: number } };
type FieldMetric = { percentile?: number; category?: string };

const LAB = [
  ["largest-contentful-paint", "Largest Contentful Paint"],
  ["cumulative-layout-shift", "Cumulative Layout Shift"],
  ["total-blocking-time", "Total Blocking Time"],
  ["first-contentful-paint", "First Contentful Paint"],
  ["speed-index", "Speed Index"],
] as const;

const FIELD = [
  ["LARGEST_CONTENTFUL_PAINT_MS", "Largest Contentful Paint", (v: number) => `${(v / 1000).toFixed(1)} s`],
  ["INTERACTION_TO_NEXT_PAINT", "Interaction to Next Paint", (v: number) => `${v} ms`],
  ["CUMULATIVE_LAYOUT_SHIFT_SCORE", "Cumulative Layout Shift", (v: number) => (v / 100).toFixed(2)],
] as const;

export class SpeedError extends Error {}

export async function runSpeed(url: string, strategy: "mobile" | "desktop"): Promise<SpeedReport> {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", strategy);
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55_000);
  try {
    const res = await fetch(api, { signal: controller.signal, cache: "no-store" });
    if (res.status === 429) throw new SpeedError("Google's speed test is busy right now. Try again in a minute.");
    if (!res.ok) throw new SpeedError("Google couldn't run a speed test on this page.");
    const data = (await res.json()) as {
      lighthouseResult?: { categories?: { performance?: { score?: number | null } }; audits?: Record<string, Audit> };
      loadingExperience?: { metrics?: Record<string, FieldMetric> };
    };
    const audits = data.lighthouseResult?.audits ?? {};
    const perf = data.lighthouseResult?.categories?.performance?.score;
    const fieldMetrics = data.loadingExperience?.metrics;
    const field = fieldMetrics
      ? FIELD.flatMap(([key, label, fmt]) => {
          const m = fieldMetrics[key];
          return m?.percentile !== undefined ? [{ label, category: m.category ?? "", display: fmt(m.percentile) }] : [];
        })
      : [];
    return {
      strategy,
      score: typeof perf === "number" ? Math.round(perf * 100) : null,
      metrics: LAB.map(([id, label]) => ({
        id,
        label,
        display: audits[id]?.displayValue ?? "–",
        score: typeof audits[id]?.score === "number" ? Math.round((audits[id].score as number) * 100) : null,
      })),
      field: field.length ? field : null,
      opportunities: Object.values(audits)
        .filter((a) => a.details?.type === "opportunity" && (a.details.overallSavingsMs ?? 0) >= 100)
        .sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
        .slice(0, 6)
        .map((a) => ({ title: a.title ?? "", savings: `${((a.details?.overallSavingsMs ?? 0) / 1000).toFixed(1)} s` })),
    };
  } catch (error) {
    if (error instanceof SpeedError) throw error;
    throw new SpeedError(error instanceof Error && error.name === "AbortError" ? "Google's speed test took too long." : "Google couldn't run a speed test on this page.");
  } finally {
    clearTimeout(timer);
  }
}
