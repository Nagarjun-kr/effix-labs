// Best-effort, in-memory per-IP limiter (per server instance). Good enough to stop casual abuse of free tools.
const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function clientKey(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function allow(request: Request, name: string, limit: number, windowMs = 60_000) {
  let buckets = stores.get(name);
  if (!buckets) stores.set(name, (buckets = new Map()));
  const key = clientKey(request);
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
