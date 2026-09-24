# Backend file structure

The backend is a small Cloudflare Worker project. The backend source of truth is `backend/src/index.ts`; the other files configure the runtime and tests.

```text
backend/
	src/index.ts              Worker routes, D1 helpers, and CallRoom Durable Object
	test/index.spec.ts        Health endpoint unit and integration tests
	test/browser.session.ts   Manual multi-browser session launcher
	package.json              Development, test, type generation, and deploy scripts
	tsconfig.json             TypeScript configuration
	vitest.config.mts         Vitest and Cloudflare test setup
	wrangler.jsonc            Worker, D1, Durable Object, and migration bindings
	worker-configuration.d.ts Generated Cloudflare binding types
	AGENTS.md                 Backend-specific contribution instructions
```

## `src/index.ts` sections

- Constants and types define presence TTL, name limits, peer state, signaling messages, and call invite state.
- `json` creates JSON responses with permissive CORS headers.
- `ensure*Table` lazily creates the D1 tables used by the API.
- `CallRoom` owns one Durable Object instance, its SQLite participant list, WebSocket lifecycle, and signaling broadcast.
- The default export handles health, presence, call, room, and WebSocket upgrade routes.

The backend currently keeps schema creation in request-time helpers. This makes local setup simple, while production schema changes should be treated carefully because existing data and deployments may already depend on those tables.
