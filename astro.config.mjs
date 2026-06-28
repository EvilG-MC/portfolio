// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build
export default defineConfig({
	// Static output — the whole site is prerendered at build time.
	// Live widgets (Discord presence, Spotify bar, particles) run client-side.
	output: "static",
	devToolbar: { enabled: false },

	// GitHub Pages project site: served at https://evilg-mc.github.io/portfolio/.
	// `site` makes og:url / <link canonical> absolute; `base` prefixes every
	// internal link & asset. If you switch to a user page (EvilG-MC.github.io) or
	// a custom domain, drop `base` and set `site` to that root URL.
	site: "https://evilg-mc.github.io",
	base: "/portfolio",
});
