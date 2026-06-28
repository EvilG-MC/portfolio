// Prefix internal links with the configured `base` (import.meta.env.BASE_URL),
// so they keep working whether the site is served from the root or a subpath
// (e.g. GitHub Pages project sites at /portfolio/). Works in dev too.

const BASE = import.meta.env.BASE_URL; // "/" or "/portfolio/" (always trailing /)

/** Turn a root-relative path ("/projects") into a base-aware href. */
export function withBase(path: string): string {
	return BASE.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
}
