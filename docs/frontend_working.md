# Frontend working flow

## Entering the workspace

1. The visitor opens the landing page and selects **Enter workspace**.
2. `/call` restores the saved ID and name, or displays the name form.
3. On submit, the page stores a stable ID in local storage and a session ID in session storage.
4. The page registers presence immediately and every 20 seconds.
5. The direct-call directory refreshes its visible user list every five seconds.

If the directory request fails, `VideoCall` uses a one-hour local cache of the last successful online-user list.

## One-on-one call

1. `VideoCall` polls `/api/calls` for the current user while it shows the directory.
2. Selecting a person creates an `invite` record and shows the outgoing call surface.
3. The other browser sees the pending invite during polling and can accept or decline it.
4. Both browsers derive the same room ID by sorting the two user IDs and joining them with `:`.
5. `useCallRoom` requests local media, opens `/ws/<roomId>?kind=direct`, and exchanges WebRTC signaling messages.
6. The browser establishes the peer connection. Video and audio then flow peer-to-peer.
7. Microphone and camera controls enable or disable local tracks and broadcast `media-state` to the peer.
8. Leaving the call ends the D1 invite, closes the socket, stops tracks, and returns to the directory.

## Multi-person room

1. `VideoRooms` polls `GET /api/rooms` every five seconds to display rooms that currently have presence rows.
2. A user enters a room name or selects an active room.
3. `useCallRoom` opens `/ws/<roomId>?kind=room` and receives the current participant list.
4. New and existing participants negotiate individual WebRTC connections. Each participant gets a tile.
5. Tiles can be reordered by drag and drop or promoted to a spotlight view. The tile-size slider changes the responsive grid minimum.
6. Leaving closes the WebSocket. The backend removes the participant's room-presence row and notifies the remaining clients.

## Browser and deployment notes

- Camera and microphone access requires a secure origin in deployed environments; localhost is treated as secure by modern browsers.
- The backend URL is read from `NEXT_PUBLIC_API_URL`. The default is `http://localhost:8787`.
- The frontend supports standard Next commands and also has Vinext/Cloudflare scripts in `package.json`.
- WebRTC connectivity may fail for restrictive networks because only a public STUN server is configured and no TURN service is present.
