# Backend architecture

## Responsibility split

The backend has two storage and coordination layers:

### Cloudflare Worker

The Worker is the HTTP entry point. It validates small request payloads, creates or updates D1 records, removes expired records, and routes WebSocket upgrades to the correct Durable Object.

### D1 database

D1 stores application-level coordination data:

| Table | Purpose | Lifetime rule |
| --- | --- | --- |
| `online_users` | Directory of users currently available for direct calls | `expires_at` is 45 seconds after registration; expired rows are deleted during reads |
| `call_invites` | Pending, accepted, rejected, and ended direct-call invitations | Invitations expire after 60 seconds and are cleaned during reads |
| `room_presence` | Names and IDs currently present in named rooms | Rows are removed when the room WebSocket closes |

### `CallRoom` Durable Object

Each room ID maps to one `CallRoom` instance through `env.CALL_ROOM.getByName(roomId)`. The object maintains a local SQLite `participants` table and WebSocket connections. It sends room membership events and forwards WebRTC signaling messages to a specific participant.

The object does not relay audio or video. Browser peers exchange media directly after the object has forwarded their SDP and ICE messages.

## Request boundaries

- `GET /health` is a liveness check.
- `/api/presence` manages the online directory.
- `/api/calls` manages direct-call invitation state.
- `GET /api/rooms` lists rooms represented in `room_presence`.
- `GET /ws/:roomId` upgrades to a WebSocket and forwards the request to `CallRoom`.

The Worker returns JSON for API failures and uses `426` when a WebSocket endpoint is called without an upgrade request.

