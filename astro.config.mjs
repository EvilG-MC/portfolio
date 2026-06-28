// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build
export default defineConfig({
	// Static output — the whole site is prerendered at build time.
	// Live widgets (Discord presence, Spotify bar, particles) run client-side.
	output: "static",
	devToolbar: { enabled: false },

	// Once a domain is set, uncomment this so og:url / <link canonical> become
	// absolute URLs in the link embeds (Discord, Twitter, etc.).
	// site: "https://your-domain.com",
});
