# Andrea & Jason's Wedding — *What To Do* Guide 💍🏔️

An interactive, mobile-first guide to things to do, see, and eat around our wedding hub in
**Lyons, Colorado** — reaching out to Denver, Boulder, Longmont, Estes Park, Nederland, Grand Lake,
and Rocky Mountain National Park.

The whole thing turns on one idea: the **Andrea ↔ Jason slider**. It's a sensibility/intensity scale,
played for laughs but genuinely useful. Drag it to set the most intense thing you'd actually do today,
and both the list **and** the map filter live.

- **1 — Full Andrea:** sit, sip, stroll. Zero risk to the timeline.
- **5 — Full Jason:** you might miss the wedding. Bring the headlamp you'll deny needing.

## What's in here

- **Map view** (Leaflet + OpenStreetMap) — every place with coordinates gets a pin, colored on a
  green→red ramp by its rating. A distinct heart marker shows the Lyons hub.
- **List view** — cards grouped by category (Attractions, Food, Itinerary), each with its rating
  badge, town, drive time from Lyons, an all-access badge, and our personal notes (verbatim).
- **The intensity slider** — the primary filter (1–5), with category chips, an all-access toggle,
  and free-text search as secondary filters.
- **Map ↔ list sync** — tap "Show on map" on a card to fly to its pin; open a pin to flash its card.
- **RMNP reservations banner** — a prominent, verified 2026 timed-entry explainer that the
  reservation-dependent activities link to.

## Tech stack

- **[Astro](https://astro.build/)** — static output, fast HTML, one tiny interactive island (~3 kB gzip).
- **[Leaflet](https://leafletjs.com/)** + **[OpenStreetMap](https://www.openstreetmap.org/)** tiles — keyless, no billing.
- Plain CSS, mobile-first. No framework, no build secrets.

## Project structure

```
.
├── astro.config.mjs          # Astro config (static output)
├── wrangler.toml             # Cloudflare Worker config (static assets)
├── worker/index.js           # tiny Worker entry (fallback handler)
├── public/                   # favicon, OG image
└── src/
    ├── data/places.json      # ← single source of truth for all places
    ├── lib/ratings.js        # shared rating ramp + helpers (build + runtime)
    ├── layouts/Layout.astro  # HTML shell + global styles / design tokens
    ├── components/
    │   ├── FilterBar.astro   # the Andrea↔Jason slider + secondary filters
    │   ├── PlaceCard.astro   # one list card
    │   ├── RmnpBanner.astro  # the RMNP reservations banner
    │   └── MapView.astro     # Leaflet map container + marker/popup styles
    └── pages/
        ├── index.astro       # assembles the page + the interactive island
        └── 404.astro
```

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
```

## Build

```bash
npm run build        # outputs static site to ./dist
npm run preview      # preview the production build locally
```

## Editing the guide

Everything is driven by **`src/data/places.json`** — no place data is hardcoded in components.
To add or change a spot, edit that file and rebuild. Each entry looks like:

```jsonc
{
  "id": "kebab-case-slug",          // unique
  "name": "Official display name",
  "formerName": "Old listing name", // optional, shown subtly
  "nickname": "Internal nickname",  // optional, shown subtly
  "category": "Attraction/Activity | Restaurant/Food | Itinerary Idea",
  "rating": 3,                       // 1–5, drives the slider
  "ratingJason": 4,                  // optional alt "Jason version" rating
  "ratingRange": [2, 5],             // optional, for entries spanning intensities
  "allAccess": true,                 // both Andrea & Jason approve
  "town": "Human-readable locale",
  "lat": 40.0, "lng": -105.0,        // or null for concept-only entries (no pin)
  "gpsPrecision": "exact | approximate | none",
  "driveFromLyons": "~50 min",       // or null
  "reservation": "RMNP timed-entry required",  // or null
  "tags": ["hike", "alpine"],
  "notes": ["Our voice — kept verbatim, never reworded."],
  "verified": "Web-verified facts, point-in-time."
}
```

Notes:
- `notes` are rendered **verbatim** — that's the voice of the guide.
- A `reservation` that mentions an **RMNP timed-entry** automatically links to the RMNP banner.
- Rating colors (slider, badges, markers) all come from `src/lib/ratings.js` — change them once there.

## Deploy to Cloudflare Pages

This is a static site, so it deploys to **Cloudflare Pages**. You'll use **your own** Cloudflare
account. No app secrets are needed at runtime (Leaflet + OSM are keyless) — the only credential is a
Cloudflare API token used at deploy time. Pick whichever option suits you:

### Option A — Connect the repo in the Cloudflare dashboard (no token to manage)

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick this repo,
and set:
- **Build command:** `npm run build`
- **Output directory:** `dist`

Every push then deploys automatically and you get a `*.pages.dev` URL.

### Option B — Deploy from the CLI

```bash
npm install
npm run build                                  # produces ./dist
npx wrangler login                             # one-time, opens your browser
npx wrangler pages deploy                      # uses pages_build_output_dir from wrangler.toml
```

Or non-interactively with an API token (no browser needed):

```bash
CLOUDFLARE_API_TOKEN=xxxx CLOUDFLARE_ACCOUNT_ID=yyyy \
  npx wrangler pages deploy --project-name=andrea-jason-wedding-guide --branch=main
```

### Option C — GitHub Actions (auto-deploy on push)

`.github/workflows/deploy.yml` builds and deploys to Pages on every push. Add two repository
secrets under **Settings → Secrets and variables → Actions**:
- `CLOUDFLARE_API_TOKEN` — a token with the **Account → Cloudflare Pages → Edit** permission
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

### Notes

- `name` in `wrangler.toml` becomes the `*.pages.dev` subdomain — change it if you'd like a
  different URL.
- OpenStreetMap's public tiles are fine for this volume. If usage ever becomes a concern, you can
  swap the tile URL in `src/pages/index.astro` for another free provider.

## A note on the facts

The `verified` details are point-in-time. **Re-check hours, road & trail status, and especially RMNP
reservations before you go** — the mountains, and Recreation.gov, change their minds.
