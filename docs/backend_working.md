# Backend working flow

## User presence

1. The frontend creates or restores a browser user ID and a session ID.
2. It sends `POST /api/presence` with `{ id, name, sessionId }`.
3. The Worker stores the user with `expires_at = now + 45 seconds`.
4. The frontend repeats registration every 20 seconds.
5. `GET /api/presence` returns only unexpired users and schedules cleanup for old rows.
6. On page exit or cleanup, the frontend sends `DELETE /api/presence` for the session.

Names are trimmed and limited to 40 characters.

## Direct call invitation

`POST /api/calls` accepts these actions:

- `invite`: ends an older pending invite between the same pair, creates a UUID call ID, and stores a pending invite for 60 seconds.
- `accept`: changes a pending invite to `accepted` when the callee ID matches.
- `reject`: changes a pending invite to `rejected` when the callee ID matches.
- `end`: changes the invite to `ended` when the requesting ID is the caller or callee.

`GET /api/calls?userId=...` returns the caller's or callee's recent non-ended invite records. The frontend polls this endpoint every two seconds to detect incoming calls, rejection, and remote hang-up. `DELETE /api/calls` removes a call record by call ID and participant ID.

## Room discovery and WebSockets

When a room participant connects, `CallRoom`:

1. Validates the `id`, `name`, and `session` query parameters.
2. Accepts the WebSocket and stores the connection attachment.
3. Reads existing participants from its Durable Object SQLite table.
4. Inserts the new participant and, for named rooms, adds a row to D1 `room_presence`.
5. Sends `room-state` to the new client and broadcasts `participant-joined`.

The Worker forwards `GET /ws/:roomId` to the Durable Object with `kind=direct` or `kind=room`. A message of type `signal` is delivered only to its `to` participant; `media-state` is broadcast to the rest of the room. Closing a socket removes the participant and broadcasts `participant-left`.

## Local commands

From `backend/`:

```bash
npm run dev       # start Wrangler development server, normally on port 8787
npm test          # run Vitest
npm run cf-typegen
npm run deploy
```

The included tests currently cover `/health`. The browser session helper opens five Playwright browser contexts against `http://localhost:3000` for manual multi-user testing.
