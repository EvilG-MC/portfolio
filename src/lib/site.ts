// ─── Site identity ───────────────────────────────────────────────────────────
// Override these via PUBLIC_* env vars (see .env.example). They're PUBLIC_ because
// the Discord ID is also read in a client-side script (the live Lanyard card), and
// PUBLIC_ vars are the only ones Astro exposes to the browser bundle.

export const GITHUB_USER = import.meta.env.PUBLIC_GITHUB_USER ?? "EvilG-MC";
export const DISCORD_ID =
	import.meta.env.PUBLIC_DISCORD_ID ?? "391283181665517568";

// Derived URLs used across components.
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const GITHUB_AVATAR = `${GITHUB_URL}.png`;
export const DISCORD_URL = `https://discord.com/users/${DISCORD_ID}`;
