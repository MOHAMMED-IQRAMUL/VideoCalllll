# Frontend architecture

## Application layers

### Entry and identity

`src/app/page.tsx` is a lightweight landing screen that routes to `/call`. The call page restores `callkaro-id` and `callkaro-name` from local storage. If they do not exist, it asks for a name, creates a UUID, and stores both values.

The call page creates a session ID in session storage and registers presence with the backend. The registration interval and cleanup are owned by the page, so the directory is shared by both feature views.

### Feature shell

`call/page.tsx` provides the sidebar, active feature selection, responsive collapse behavior, and active-session confirmation. It passes the current `Peer` identity to either `VideoCall` or `VideoRooms`.

### Shared call transport

`useCallRoom` is the transport boundary for both features. It:

- Requests local camera and microphone access.
- Opens a WebSocket URL for a room ID.
- Creates one `RTCPeerConnection` per remote peer.
- Adds local tracks and handles offers, answers, and ICE candidates.
- Tracks remote streams and remote audio/video state.
- Stops local tracks and closes sockets and peer connections during cleanup.

The hook uses a deterministic ID comparison (`user.id < peer.id`) to choose which peer creates the initial offer. This prevents both sides from simultaneously initiating the same connection.

### Feature-specific UI

`VideoCall` handles the directory, call invitation polling, accept/reject/end transitions, and the two-person surface. `VideoRooms` handles room listing, room join/leave, participant tiles, tile ordering, spotlighting, and room controls.

## Data flow

```text
CallPage identity/presence
	|
	+--> VideoCall --> /api/presence + /api/calls --> useCallRoom --> direct WebSocket
	|
	+--> VideoRooms --> /api/rooms ----------------> useCallRoom --> room WebSocket
```

All media remains in the browser/WebRTC layer. The backend is used for discovery, call state, membership, and signaling only.
