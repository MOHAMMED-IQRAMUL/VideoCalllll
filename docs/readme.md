# CallKaro documentation

This folder explains how the repository is organized and how a browser call moves through the system.

## Reading order

1. [Backend file structure](be_file_struct.md) and [frontend file structure](fe_file_struct.md) for the code map.
2. [Backend architecture](backend_architecture.md) and [frontend architecture](frontend_architecture.md) for ownership and boundaries.
3. [Backend working](backend_working.md) and [frontend working](frontend_working.md) for request, WebSocket, and WebRTC flows.
4. [Cloudflare deployment](cloudflare_deployment.md) for production setup, deployment commands, and verification.

## Product vocabulary

- **Presence**: a short-lived D1 record saying that a user is online.
- **Call invite**: a D1 record used to coordinate the 1-on-1 call before WebRTC connects.
- **Direct call room**: a deterministic Durable Object name made from the two sorted user IDs.
- **Video room**: a user-chosen room name mapped to one Durable Object instance.
- **Signaling**: WebSocket messages carrying SDP descriptions and ICE candidates. Media does not pass through the Worker.

## Important runtime assumptions

- The browser must grant camera and microphone permissions.
- WebRTC uses Google's public STUN server (`stun:stun.l.google.com:19302`); a TURN server is not configured.
- The frontend defaults to `http://localhost:8787` and can be configured with `NEXT_PUBLIC_API_URL`.
- Presence is refreshed every 20 seconds and expires after 45 seconds in the backend.
