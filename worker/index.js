/**
 * Minimal Cloudflare Worker entry.
 *
 * The static site in ./dist is served by the Workers static-assets binding
 * (see `[assets]` in wrangler.toml). With `main` set, this Worker handles any
 * request that does NOT match a static asset — here we simply delegate back to
 * the assets binding so its own 404 handling (the built 404 page) takes over.
 *
 * No secrets, no API keys: Leaflet + OpenStreetMap are keyless.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
