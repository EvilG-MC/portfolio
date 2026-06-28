// ─── GitHub data (fetched at build time) ─────────────────────────────────────
// Add or remove repo URLs here. Everything else is pulled live from the API
// during `astro build`, so the rendered HTML ships with real stats — no
// client-side requests and no public API rate limits at runtime.
// featured: true → renders as the large top card instead of the grid.

import { fetchJson, fetchText } from "./http.ts";
import { GITHUB_USER } from "./site.ts";

export interface RepoEntry {
	url: string;
	featured?: boolean;
}

export interface Project {
	name: string;
	desc: string;
	url: string;
	lang: string | null;
	org: string | null;
	stars: number;
	fork: boolean;
	forks: number;
	featured: boolean;
}

const REPOS: RepoEntry[] = [
	{ url: "https://github.com/Ganyu-Studios/stelle-music", featured: true },
	{ url: "https://github.com/Ganyu-Studios/Hoshimi" },
	{ url: "https://github.com/Ganyu-Studios/sweety-html-transcripts" },
	{ url: "https://github.com/Ganyu-Studios/discord-components" },
	{ url: "https://github.com/Ganyu-Studios/evelyn-chevalier" },
	{ url: "https://github.com/Ganyu-Studios/seyfert-template" },
];

const ORG_LABELS: Record<string, string> = {
	"Ganyu-Studios": "Ganyu Studios",
};

function parseRepo(githubUrl: string): { owner: string; repo: string } {
	const [, owner, repo] = new URL(githubUrl).pathname.split("/");
	return { owner, repo };
}

// GitHub requires a User-Agent. A token (optional) lifts the unauthenticated
// 60 req/hour limit to 5000/hour — set GITHUB_TOKEN in a .env file to use it.
const GH_TOKEN = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;

const GH_HEADERS: Record<string, string> = {
	"User-Agent": "evilg-mc-portfolio",
	Accept: "application/vnd.github+json",
	...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
};

/** Minimal card built from the URL alone, used when the API call fails. */
function fallbackProject(entry: RepoEntry): Project {
	const { owner, repo } = parseRepo(entry.url);
	return {
		name: repo,
		desc: "",
		url: entry.url,
		lang: null,
		org: ORG_LABELS[owner] ?? null,
		stars: 0,
		fork: false,
		forks: 0,
		featured: entry.featured ?? false,
	};
}

/** Real project data, or null if the API call failed (caller falls back). */
async function fetchRepo(entry: RepoEntry): Promise<Project | null> {
	const { owner, repo } = parseRepo(entry.url);
	const data = await fetchJson(
		`https://api.github.com/repos/${owner}/${repo}`,
		GH_HEADERS,
	);
	if (!data) return null;
	return {
		name: data.name,
		desc: data.description ?? "",
		url: data.html_url,
		lang: data.language ?? null,
		org: ORG_LABELS[owner] ?? null,
		stars: data.stargazers_count,
		fork: data.fork,
		forks: data.forks_count,
		featured: entry.featured ?? false,
	};
}

// Cache across requests so `astro dev` (which re-runs this per page load)
// doesn't burn through the API rate limit on every refresh.
let projectsCache: Project[] | null = null;

export async function fetchProjects(): Promise<Project[]> {
	if (projectsCache) return projectsCache;
	const results = await Promise.all(REPOS.map(fetchRepo));
	// A failed repo still renders (URL-only card) so it never silently vanishes.
	const projects = results.map((p, i) => p ?? fallbackProject(REPOS[i]));
	// Cache only a fully-successful fetch; if any repo fell back, skip the cache
	// so a later request retries and the real stats fill back in.
	if (results.every(Boolean)) projectsCache = projects;
	return projects;
}

export interface GithubProfile {
	avatar_url: string;
	name: string | null;
	followers: number | null;
	public_repos: number | null;
}

let profileCache: GithubProfile | null = null;

export async function fetchProfile(): Promise<GithubProfile | null> {
	if (profileCache) return profileCache;
	const data = await fetchJson(
		`https://api.github.com/users/${GITHUB_USER}`,
		GH_HEADERS,
	);
	if (!data) return null;
	profileCache = {
		avatar_url: data.avatar_url,
		name: data.name,
		followers: data.followers ?? null,
		public_repos: data.public_repos ?? null,
	};
	return profileCache;
}

// ─── README brief ─────────────────────────────────────────────────────────────

function extractReadmeBrief(markdown: string): string {
	const lines = markdown.split("\n");
	const prose: string[] = [];
	for (const line of lines) {
		const t = line.trim();
		if (
			!t ||
			t.startsWith("#") ||
			t.startsWith("!") ||
			t.startsWith("<") ||
			t.startsWith("---") ||
			t.startsWith("<!--") ||
			t.includes("[![")
		)
			continue;
		prose.push(t);
		if (prose.length >= 2) break;
	}
	return prose
		.join(" ")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.slice(0, 320);
}

// Render a safe subset of inline formatting from the README (HTML + markdown).
const ALLOWED_INLINE_TAGS = new Set(["b", "strong", "i", "em", "code"]);

function inlineToHtml(text: string): string {
	return (
		text
			// Drop any tag left dangling by the length slice.
			.replace(/<[^>]*$/, "")
			// Keep only whitelisted tags, stripping their attributes; remove the rest.
			.replace(/<(\/?)([a-z0-9]+)[^>]*?>/gi, (_, slash: string, tag: string) =>
				ALLOWED_INLINE_TAGS.has(tag.toLowerCase())
					? `<${slash}${tag.toLowerCase()}>`
					: "",
			)
			// Markdown fallbacks, in case the README uses them instead of HTML.
			.replace(/`([^`]+)`/g, "<code>$1</code>")
			.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
			.replace(/\*([^*]+)\*/g, "<em>$1</em>")
			.trim()
	);
}

/** Returns sanitized inline HTML for the hero brief, or null if unavailable. */
let briefCache: string | null = null;

export async function fetchReadmeBrief(): Promise<string | null> {
	if (briefCache) return briefCache;
	const md = await fetchText(
		`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_USER}/main/README.md`,
	);
	if (!md) return null;
	briefCache = inlineToHtml(extractReadmeBrief(md)) || null;
	return briefCache;
}
