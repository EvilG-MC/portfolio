// ─── Tiny fetch helpers ──────────────────────────────────────────────────────
// Every build-time data source needs the same shape: fetch, bail on a bad
// status, parse, and never throw (a failed fetch should degrade gracefully, not
// break the build). These wrap that once so callers just check for null.

async function ok(
	url: string,
	headers?: Record<string, string>,
): Promise<Response | null> {
	try {
		const res = await fetch(url, headers ? { headers } : undefined);
		return res.ok ? res : null;
	} catch {
		return null;
	}
}

/** Fetch + parse JSON, or null on any network/HTTP/parse failure. */
export async function fetchJson<T>(
	url: string,
	headers?: Record<string, string>,
): Promise<T | null> {
	const res = await ok(url, headers);
	if (!res) return null;
	try {
		return (await res.json()) as T;
	} catch {
		return null;
	}
}

/** Fetch raw text, or null on any network/HTTP failure. */
export async function fetchText(
	url: string,
	headers?: Record<string, string>,
): Promise<string | null> {
	const res = await ok(url, headers);
	return res ? res.text() : null;
}
