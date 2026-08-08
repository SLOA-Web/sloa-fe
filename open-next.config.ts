import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ponytail: no incremental-cache override (R2, KV, etc). The app doesn't use
// ISR/revalidate today; add an override here if that changes.
export default defineCloudflareConfig();
