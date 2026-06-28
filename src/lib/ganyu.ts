// ─── Ganyu character data (fetched at build time) ────────────────────────────
// Lore/stats come from the genshin.dev API. Since they never change, we fetch
// them once at build and render the stats as static HTML.

import { fetchJson } from "./http.ts";

const GANYU_API = "https://genshin.jmp.blue/characters/ganyu";
// Image endpoints in order of preference. We probe at build and use the first
// that responds, so the portrait is a plain static <img> with no client JS.
const GANYU_IMAGES = ["portrait", "card", "gacha-splash", "icon-big", "icon"];

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export interface GanyuStat {
	label: string;
	value: string;
	/** True for the Vision row, which renders a coloured dot. */
	vision?: boolean;
}

export interface GanyuData {
	stats: GanyuStat[];
	description: string | null;
	rarity: number | null;
	vision: string | null;
	imageUrl: string;
}

function formatBirthday(b?: string): string | null {
	if (!b) return null;
	const [, m, d] = b.split("-").map(Number);
	return MONTHS[m - 1] ? `${MONTHS[m - 1]} ${d}` : null;
}

async function resolveImage(): Promise<string> {
	for (const ep of GANYU_IMAGES) {
		try {
			const res = await fetch(`${GANYU_API}/${ep}`, { method: "HEAD" });
			if (res.ok) return `${GANYU_API}/${ep}`;
		} catch {
			/* try next */
		}
	}
	return `${GANYU_API}/portrait`;
}

// Cache across requests so `astro dev` (which re-runs this per page load)
// doesn't re-probe the image endpoints and re-hit the API on every refresh.
// Ganyu's data never changes, so a single fetch per process is plenty.
let ganyuCache: GanyuData | null = null;

export async function fetchGanyu(): Promise<GanyuData> {
	if (ganyuCache) return ganyuCache;

	const imageUrl = await resolveImage();
	const data = await fetchJson(GANYU_API);

	// API unreachable — the image and the personal note still stand. Don't cache
	// this degraded result, so a later request can retry and recover the stats.
	if (!data)
		return {
			stats: [],
			description: null,
			rarity: null,
			vision: null,
			imageUrl,
		};

	const stats: GanyuStat[] = [
		{ label: "Title", value: data.title },
		{ label: "Vision", value: data.vision, vision: true },
		{ label: "Weapon", value: data.weapon },
		{ label: "Region", value: data.nation },
		{ label: "Constellation", value: data.constellation },
		{ label: "Birthday", value: formatBirthday(data.birthday) ?? "" },
	].filter((s): s is GanyuStat => Boolean(s.value));

	ganyuCache = {
		stats,
		description: data.description ?? null,
		rarity: data.rarity ?? null,
		vision: data.vision ?? null,
		imageUrl,
	};
	return ganyuCache;
}
