# Project Instructions — Andrea & Jason's Wedding "What To Do" Guide

These instructions are written for **Claude Code** to scaffold a GitHub repo and build an interactive,
mobile-first wedding guide website, served via a **Cloudflare Worker**. Build to this spec.

---

## 1. What we're building

An interactive map-and-list guide of things to do, see, and eat around our wedding hub in
**Lyons, Colorado** (with entries reaching into Denver / Boulder / Longmont / Estes Park /
Nederland / Grand Lake / RMNP). Guests filter activities by intensity using the custom
**"Andrea ↔ Jason" scale** and see everything plotted on a map.

The single most important UX idea: **the Andrea↔Jason slider.** It's a sensibility/intensity
scale, played for laughs but genuinely useful.

- **Andrea (low / 1):** reasonable, responsible, approachable. You make it to the wedding clean and uninjured.
- **Jason (high / 5):** not entirely sensible. You might miss the wedding. Bring the headlamp you'll deny needing. It's 10 more miles than the sign said.

| Rating | Label | Meaning |
|--------|-------|---------|
| 1 | Full Andrea | Sit, sip, stroll. Zero risk to the timeline. |
| 2 | Andrea | Easy and pleasant. Light effort, well-marked, predictable. |
| 3 | The Middle | A real activity, but you'll be fine. Bring water. |
| 4 | Jason-curious | Long, strenuous, or logistically ambitious. Plan ahead. |
| 5 | Full Jason | You might miss the wedding. Bring the headlamp you'll deny needing. |

---

## 2. Tech stack (decided)

- **Framework:** **Astro** (static output).
- **Map:** **Leaflet** + **OpenStreetMap** tiles. No API key, no billing. Custom markers colored by rating.
- **Filter control:** **single "max intensity" slider** (1–5). Default position: 5 (show everything).
- **Data:** a single **`places.json`** file is the source of truth (`src/data/places.json`).
- **Styling:** plain CSS, mobile-first.
- **Deploy target:** **Cloudflare Worker** serving the built static assets (see section 7).

---

## 3. Core features

1. **Map view (Leaflet)** — centered on Lyons, CO; one marker per place with coords; marker color
   encodes rating (green→red); popups with name, town, rating label, drive time, notes, verified
   facts, and reservation; a distinct "home" marker for the Lyons venue.
2. **List view** — cards grouped by category; rating badge, town, drive time, all-access badge,
   notes, formerName/nickname shown subtly, and a "show on map" action.
3. **The Andrea↔Jason intensity slider (primary filter)** — single slider 1–5, "Andrea"→"Jason";
   filters list AND map live; shows current threshold label + one-liner. Old Fall River Road uses
   base `rating` (2) for filtering but displays its dual Andrea(2)/Jason(4) rating.
4. **Secondary filters** — category toggle, optional all-access toggle, free-text search.
5. **Map ↔ list sync** — card click focuses marker; marker click highlights/scrolls to card.
6. **RMNP reservation callout** — the `rmnp-reservations` entry renders as a prominent banner;
   reservation-dependent places link to it.

---

## 4. Data model — `places.json`

```
meta: { title, hub:{name,lat,lng}, ratingScale:{1..5:{label,meaning}}, scaleNote }
categories: [ "Attraction/Activity", "Restaurant/Food", "Itinerary Idea" ]
places: [ {
  id, name, formerName?, nickname?, category, rating, ratingJason?, ratingRange?,
  allAccess, town, lat, lng, gpsPrecision, driveFromLyons, reservation, tags,
  notes, verified
} ]
```

Notes for rendering:
- `notes` is the voice of the guide — never paraphrase it. `verified` is supplemental factual detail.
- 22 of 26 places have coordinates; the 4 with `lat:null` (airport drive, Peak-to-Peak scenic drive,
  Grand Lake/Winter Park loop, RMNP reservations explainer) are list/banner-only.
- The data should be trivially editable by hand to add places later.

---

## 5. Repo structure

```
/
├── README.md
├── PROJECT-INSTRUCTIONS.md
├── package.json
├── astro.config.mjs
├── wrangler.toml
├── src/
│   ├── data/places.json
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   └── pages/index.astro
├── public/
└── worker/
```

---

## 6. Design direction

Mobile-first; thumb-friendly slider; map and list both reachable. Warm, celebratory, outdoorsy
Front-Range tone; humor preserved. Consistent green→red rating ramp across slider, badges, markers.
Accessible (contrast, keyboard, alt text, `prefers-reduced-motion`). Lightweight; lazy-load the map.

---

## 7. Cloudflare Worker deployment

Serve the built static site from a Cloudflare Worker (Workers static-assets binding) or Cloudflare
Pages. `wrangler.toml` carries placeholders for `name`, `account_id`, and route/domain. Document the
flow in the README: `npm install` → `npm run build` → `wrangler deploy` (or `wrangler pages deploy dist`).
No secrets / API keys (Leaflet + OSM are keyless).

---

## 8. Acceptance checklist

- [x] `places.json` loads and renders all 26 entries; 22 markers, 4 list/banner-only.
- [x] Intensity slider (1–5) filters list AND map live; default 5 shows all.
- [x] Marker + badge colors follow the green→red ramp consistently.
- [x] Category filter and all-access toggle work.
- [x] Clicking a card focuses its marker and vice-versa.
- [x] RMNP reservation info renders as a prominent banner; dependent places reference it.
- [x] Old Fall River Road shows its dual Andrea(2)/Jason(4) rating.
- [x] Personal `notes` text appears verbatim.
- [x] Fully usable on a phone.
- [x] `npm run build` succeeds; deployable to Cloudflare.
- [x] README documents dev + deploy steps.

---

## 9. Out of scope (for now)

No backend, database, auth, or CMS. No live data. No RSVP / registry / wedding-logistics pages.
