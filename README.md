<div align="center">

# ❄ JustEvil — Portfolio ❄

A frost-themed personal portfolio, painted in moonlight and built for the laughs.
Themed after **Ganyu** from *Genshin Impact*. No trackers, no nonsense.

Hobbyist full-stack & Discord developer · Engineering student · Open-source builder

</div>

---

## ✨ About

This is my personal portfolio — a small, deliberately over-engineered site I build on
in my free time. It's static, fast, and sprinkled with live touches (Discord presence,
GitHub stats, a drifting frost backdrop) and a couple of easter eggs for the curious.

> I'm just a developer who builds things for fun — not a professional, no clients,
> no deadlines. I make stuff because I enjoy it, and I do it as best I can.

## 🧩 Tech stack

- **[Astro](https://astro.build)** 7 — static output, multi-page, islands for the live bits
- **TypeScript** — typed components and build-time data helpers
- **Vanilla CSS** — scoped per component, frost design tokens, zero CSS frameworks
- **Canvas 2D** — the animated snow-crystal backdrop
- **[Biome](https://biomejs.dev)** — linting & formatting
- **pnpm** — package manager

No UI framework, no Tailwind — just semantic HTML and hand-written CSS.

## 🪻 Features

- **Frost backdrop** — a full-viewport canvas of drifting snow crystals + a slow aurora glow.
  Pauses when the tab is hidden, and renders a static frame under `prefers-reduced-motion`.
- **Live Discord presence** — status, custom status, and rich-presence activities pulled
  live from the [Lanyard](https://lanyard.rest) API (avatar decoration included), plus a
  Spotify "now / recently played" embed.
- **Real GitHub data** — repos, stars, followers and language counts are fetched at
  **build time** and baked into the HTML (no client-side API calls, no rate limits at runtime).
- **The Muse** — a section about Ganyu, with stats & art from the
  [genshin.dev](https://genshin.dev) API.
- **Link embeds** — Open Graph + Twitter Card meta so the site previews nicely in Discord.
- **Responsive** — mobile hamburger menu, fluid type, and a layout that holds down to 320px.
- **Accessible** — one `<main>` / `<h1>` per page, landmark roles, focus rings, reduced-motion support.

## 🗂️ Structure

```
src/
├── components/      UI components (each with its own scoped <style>)
│   ├── Hero.astro          # landing: intro, GitHub stats, avatar + frost halo
│   ├── Skills.astro
│   ├── Projects.astro / ProjectMeta.astro
│   ├── DiscordPresence.astro   # live Lanyard card + Spotify
│   ├── GanyuMuse.astro
│   ├── FrostField.astro    # the snow-crystal canvas
│   ├── Nav.astro / Footer.astro / SocialLinks.astro
│   ├── Icon.astro          # inline line/brand icons
│   └── ConsoleSignature.astro  # the console greeting + easter eggs
├── layouts/Layout.astro    # <head>, embeds, shared chrome
├── lib/             build-time data (cached, fail-soft)
│   ├── github.ts    # repos + profile + README brief
│   ├── ganyu.ts     # genshin.dev character data
│   └── http.ts      # tiny fetch helpers
├── pages/           /, /projects, /presence, /muse
└── styles/global.css  # tokens, reset, shared primitives only
```

## 🚀 Getting started

```bash
pnpm install
pnpm dev          # dev server → http://localhost:4321
pnpm build        # static build → dist/
pnpm preview      # preview the build
pnpm lint         # biome lint
pnpm format       # biome format
```

> **Note:** when editing inline `<script>` tags (e.g. the particle system), restart
> `pnpm dev` rather than relying on HMR — Astro's hot-reload for inline scripts can go stale.

## ⚙️ Configuration

| What | Where |
|------|-------|
| GitHub user & Discord ID | `.env` (`PUBLIC_GITHUB_USER`, `PUBLIC_DISCORD_ID`) — central in `src/lib/site.ts` |
| Repos shown in Projects | `REPOS` array in `src/lib/github.ts` |
| Skills list | `src/components/Skills.astro` |
| Deploy URL (for `og:url` / canonical) | `site` in `astro.config.mjs` (commented until set) |

### Environment variables (optional)

Copy `.env.example` → `.env`. Everything has a default, so the site builds without any.

```env
# Who the site is about — used for GitHub stats, avatar, links, and the live
# Discord card. PUBLIC_ so they reach the browser bundle too.
PUBLIC_GITHUB_USER=EvilG-MC
PUBLIC_DISCORD_ID=391283181665517568

# Lifts the GitHub API from 60 → 5000 requests/hour at build time (build-only).
GITHUB_TOKEN=ghp_xxx
```

Everything degrades gracefully: if an API is unreachable at build, the site falls back to
last-known values instead of breaking.

## 🌐 Deploy

The site is fully static (`output: "static"`), so `dist/` drops onto any static host —
Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc. Once you have a URL, uncomment and
set `site` in `astro.config.mjs` so the link embeds get absolute `og:url` / canonical tags.

## 🥚 Easter eggs

Open the browser console and try:

- `ganyu()` — a quiet little reward.
- `frost()` — let it snow. ❄
- The **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) — let it blizzard.

There's a note for source-viewers too. 👀

## 📜 Credits & license

Code is **MIT** licensed. Ganyu and all related assets are property of
**miHoYo Co. Ltd. (HoYoverse)** — this is a fan-themed personal portfolio, not affiliated
with HoYoverse.

<div align="center">

Made with 🐐❤️💪 — by the community, for the community.

</div>
