/**
 * Single source of truth for the Andrea↔Jason rating ramp.
 * Used at build time (Astro components) AND at runtime (client island)
 * so slider, badges, and map markers stay perfectly consistent.
 *
 * Green → red ramp:
 *   1 = green, 2 = light green, 3 = amber, 4 = orange, 5 = red.
 */
export const RATING_COLORS = {
  1: '#2e9e5b', // green
  2: '#6aa83c', // light green
  3: '#d99100', // amber
  4: '#e2691c', // orange
  5: '#cc3b3b', // red
};

// All ramp colors are chosen dark enough to carry white text accessibly.
export const RATING_TEXT_ON = '#ffffff';

// "Other Activities" items (rating null) sit off the green→red ramp entirely.
export const BEYOND_COLOR = '#7a6f9b';

/** A left→right green-to-red gradient for the slider track. */
export const RATING_GRADIENT = `linear-gradient(90deg, ${RATING_COLORS[1]} 0%, ${RATING_COLORS[2]} 25%, ${RATING_COLORS[3]} 50%, ${RATING_COLORS[4]} 75%, ${RATING_COLORS[5]} 100%)`;

export function ratingColor(rating) {
  if (rating == null) return BEYOND_COLOR;
  return RATING_COLORS[rating] || RATING_COLORS[3];
}

/**
 * Effective rating used by the intensity slider.
 * Old Fall River Road keeps its base `rating` (2) for filtering even though it
 * carries a `ratingJason` of 4 — per spec, the slider treats the base rating.
 * Indian Peaks Wilderness uses its default `rating` (4), not the range.
 */
export function effectiveRating(place) {
  return place.rating;
}

/** Build the searchable text blob for a place (name + nicknames + notes + town + tags). */
export function searchText(place) {
  return [
    place.name,
    place.formerName,
    place.nickname,
    place.town,
    ...(place.notes || []),
    ...(place.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
