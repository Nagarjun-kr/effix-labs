// Reads a JSON request body with a size cap (used by lib/edge-guard.ts). No imports, so tests can load it directly.
export class TooLarge extends Error {}

/** Reads and parses a JSON body of at most maxBytes; returns null for invalid JSON, throws TooLarge when too big. */
export async function readJson<T>(request: Request, maxBytes: number): Promise<T | null> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new TooLarge();
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new TooLarge();
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.byteLength; }
  try {
    return JSON.parse(new TextDecoder().decode(all)) as T;
  } catch {
    return null;
  }
}

