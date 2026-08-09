# SLOA Frontend

Next.js (App Router) frontend for the Sri Lanka Orthopaedic Association. Talks to the `sloa-api` backend for auth/members/events/payments, and to Sanity for news & publications content.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) (the dev server runs on port 8000, not the Next.js default 3000).

## Environment variables

Create a `.env` in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000   # sloa-api base URL
NEXT_PUBLIC_SANITY_PROJECT_ID=                    # optional, defaults to the shared dev project
NEXT_PUBLIC_SANITY_DATASET=                       # optional, defaults to "production"
```

`NEXT_PUBLIC_*` vars are inlined at build time, so they must be set wherever the app is built, not just at runtime.

## Scripts

- `npm run dev` - local dev server (port 8000)
- `npm run build` - production Next.js build
- `npm run lint` - ESLint
- `npm run preview` - build for Cloudflare Workers and serve it locally in the Workers runtime (closest thing to a prod smoke test)
- `npm run deploy` - build and deploy to Cloudflare Workers
- `npm run cf-typegen` - regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` bindings

## Deployment

Deploys to Cloudflare Workers via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`), configured in `wrangler.jsonc` and `open-next.config.ts`.

Production deploys run through Cloudflare Workers Builds (dashboard Git integration on the connected GitHub repo), not a GitHub Actions workflow:
- Build command: `npx @opennextjs/cloudflare build`
- Deploy command: `npx @opennextjs/cloudflare deploy`
- Build environment variables (`NEXT_PUBLIC_API_BASE_URL`, etc.) are set in the Worker's dashboard settings.

To deploy manually from the command line instead:

```bash
npm run deploy
```

Note: the Vercel Edge Runtime (`export const runtime = "edge"`) is not supported by this adapter, don't add it to any route.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext Cloudflare docs](https://opennext.js.org/cloudflare)
