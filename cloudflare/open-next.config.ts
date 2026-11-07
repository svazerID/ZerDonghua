// default open-next.config.ts file created by @opennextjs/cloudflare
//
// Deliberately NOT in the project root: when `open-next.config.ts` sits next
// to next.config.ts, `wrangler deploy` (the Workers Builds production deploy
// command) hands off to `opennextjs-cloudflare deploy` before running the
// wrangler.jsonc custom build, which then fails with "Could not find compiled
// Open Next config". Every `opennextjs-cloudflare build` must therefore pass
// `--openNextConfigPath cloudflare/open-next.config.ts` (see wrangler.jsonc
// and the package.json scripts). See FIX_LOG.md.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
	// incrementalCache: r2IncrementalCache
});
