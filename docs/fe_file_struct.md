# Frontend file structure

The frontend uses Next.js App Router with client-side interaction for the calling workspace.

```text
frontend/
	src/app/layout.tsx                 Global metadata, CSS, and document shell
	src/app/page.tsx                   Landing page and entry point to `/call`
	src/app/call/page.tsx              Identity entry, feature navigation, and session guard
	src/app/components/CallIcon.tsx    Local SVG icon set used by call controls
	src/app/components/useCallRoom.ts  Shared WebSocket and WebRTC hook
	src/app/components/VideoCall.tsx   Direct-call directory, invites, call surface, and controls
	src/app/components/VideoRooms.tsx  Room join/discovery UI, room surface, and tiles
	src/app/globals.css                Theme variables, base styles, and room grid CSS
	package.json                       Next, Vinext, lint, build, and deployment scripts
	next.config.ts                     Next configuration
	vite.config.ts                     Vite/Vinext configuration
	wrangler.jsonc                     Cloudflare frontend deployment configuration
```

## Component ownership

- `call/page.tsx` owns the signed-in browser identity, feature switching, and protection against switching while a session is active.
- `VideoCall.tsx` owns presence polling and direct-call invite state, then renders the direct-call surface.
- `VideoRooms.tsx` owns room discovery and the selected room, then renders the multi-participant surface.
- `useCallRoom.ts` owns transport and peer connection state so both call modes use the same signaling behavior.
- `globals.css` owns theme tokens and the responsive room tile grid; most component layout classes use Tailwind utilities.
