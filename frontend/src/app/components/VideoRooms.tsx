"use client";

import { useEffect, useRef, useState } from "react";
import { Peer, useCallRoom } from "./useCallRoom";
import CallIcon from "./CallIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
type ActiveRoom = { roomId: string; users: Peer[] };

export default function VideoRooms({ user, onSessionChange }: { user: Peer; onSessionChange: (active: boolean) => void }) {
  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>([]);

  const joinRoom = (nextRoomId: string) => {
    const trimmed = nextRoomId.trim();
    if (!trimmed) return;
    setRoomId(trimmed);
    onSessionChange(true);
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/rooms`);
        if (response.ok) setActiveRooms((await response.json()) as ActiveRoom[]);
      } catch {
        setActiveRooms([]);
      }
    };
    void loadRooms();
    const timer = window.setInterval(() => void loadRooms(), 5000);
    return () => window.clearInterval(timer);
  }, []);

  if (!roomId) {
    return (
      <div className="h-full overflow-auto bg-[var(--color-bg)] p-4 sm:p-6">
        <div className="mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
          <div className="border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Rooms</p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.05em] text-[var(--color-text-primary)]">Create or join</h2>
            <p className="mt-2 text-sm leading-5 text-[var(--color-text-secondary)]">Enter a room name to start.</p>

            <div className="mt-4 flex gap-2">
            <input
              value={roomInput}
              onChange={(event) => setRoomInput(event.target.value)}
              placeholder="Room name"
              onKeyDown={(event) => {
                if (event.key === "Enter") joinRoom(roomInput);
              }}
              className="min-w-0 flex-1 border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition-shadow duration-150 focus:shadow-[var(--shadow-focus)]"
            />
            <button
              onClick={() => {
                const id = roomInput.trim();
                if (id) joinRoom(id);
              }}
              className="border-[var(--border-default)] bg-[var(--color-primary)] px-4 py-2 text-sm font-bold shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Join
            </button>
            </div>
          </div>

          <section className="border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Live now</p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.04em] text-[var(--color-text-primary)]">Active rooms</h3>
              </div>
              <span className="rounded-full bg-[var(--color-success-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-success)]">{activeRooms.length} open</span>
            </div>

            {activeRooms.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {activeRooms.map((room) => (
                  <button
                    key={room.roomId}
                    type="button"
                    onClick={() => joinRoom(room.roomId)}
                    className="group relative flex items-center justify-between border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-3 text-left shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-[var(--color-text-primary)]">{room.roomId}</span>
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">{room.users.length} user{room.users.length === 1 ? "" : "s"}</span>
                    </span>
                    <CallIcon name="call" className="h-5 w-5 shrink-0 text-[var(--color-success)]" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded-xl border-[var(--border-default)] bg-[var(--color-surface-dark)] p-3 text-left text-xs text-white shadow-[var(--shadow-lg)] group-hover:block">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">Users in room</span>
                      {room.users.map((member) => <span key={member.id} className="block truncate">{member.name}</span>)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-[var(--color-bg-secondary)] px-3 py-4 text-sm text-[var(--color-text-secondary)]">No active rooms yet.</p>
            )}
          </section>
        </div>
      </div>
    );
  }

  return <RoomSurface roomId={roomId} user={user} onLeave={() => { setRoomId(null); onSessionChange(false); }} />;
}

function RoomSurface({ roomId, user, onLeave }: { roomId: string; user: Peer; onLeave: () => void }) {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [leavePromptOpen, setLeavePromptOpen] = useState(false);
  const [tileMinWidth, setTileMinWidth] = useState(320);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);
  const [tileOrder, setTileOrder] = useState<string[]>([]);
  const call = useCallRoom({ roomId, user });
  const roomStateText = call.connected ? "Joined" : "Joining...";

  const tileEntries = [
    { id: "you", name: "You", stream: call.localStream, muted: !video, audioMuted: !audio, mirror: true },
    ...call.peers.map((peer) => ({
      id: peer.id,
      name: peer.name,
      stream: call.remoteStreams[peer.id] ?? null,
      muted: !call.remoteStreams[peer.id] || call.mediaStates[peer.id]?.video === false,
      audioMuted: call.mediaStates[peer.id]?.audio === false,
      mirror: false,
    })),
  ];

  const orderedTiles = [
    ...tileOrder
      .map((id) => tileEntries.find((tile) => tile.id === id))
      .filter((tile): tile is (typeof tileEntries)[number] => Boolean(tile)),
    ...tileEntries.filter((tile) => !tileOrder.includes(tile.id)),
  ];

  const spotlightTile = orderedTiles.find((tile) => tile.id === spotlightId);
  const galleryTiles = orderedTiles.filter((tile) => tile.id !== spotlightId);

  const reorderTiles = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setTileOrder((current) => {
      const next = [...current];
      const fromIndex = next.indexOf(fromId);
      const toIndex = next.indexOf(toId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const toggle = (kind: "audio" | "video") => {
    const next = kind === "audio" ? !audio : !video;
    if (kind === "audio") setAudio(next);
    else setVideo(next);
    call.setMedia(kind, next);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden bg-[var(--color-bg)] p-2 sm:p-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-[var(--border-default)] bg-[var(--color-surface)] px-3 py-2.5 shadow-[var(--shadow-sm)]">
        <div>
          <p className="text-sm font-black tracking-[-0.04em] text-[var(--color-text-primary)]">Room: {roomId}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {call.peers.length + 1} participant{call.peers.length === 0 ? "" : "s"} · {roomStateText}
          </p>
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
          <span>Tile size</span>
          <input
            aria-label="Adjust tile size"
            type="range"
            min="260"
            max="520"
            step="20"
            value={tileMinWidth}
            onChange={(event) => setTileMinWidth(Number(event.target.value))}
            className="w-24 accent-[var(--color-primary)] sm:w-32"
          />
        </label>
        <button
          onClick={() => setLeavePromptOpen(true)}
          className="border-[var(--border-default)] bg-[var(--color-surface)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Leave room
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        {spotlightTile && (
          <div className="mb-3">
            <Tile
              key={spotlightTile.id}
              {...spotlightTile}
              isSpotlight
              onSpotlight={() => setSpotlightId(null)}
              draggable
              isDragging={draggedTileId === spotlightTile.id}
              onDragStart={() => setDraggedTileId(spotlightTile.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedTileId) reorderTiles(draggedTileId, spotlightTile.id);
                setDraggedTileId(null);
              }}
              onDragEnd={() => setDraggedTileId(null)}
            />
          </div>
        )}
        <div className="room-grid gap-3" style={{ "--room-tile-min": `${tileMinWidth}px` } as React.CSSProperties}>
        {galleryTiles.map((tile) => (
          <Tile
            key={tile.id}
            {...tile}
            onSpotlight={() => setSpotlightId(tile.id)}
            draggable
            isDragging={draggedTileId === tile.id}
            onDragStart={() => setDraggedTileId(tile.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedTileId) reorderTiles(draggedTileId, tile.id);
              setDraggedTileId(null);
            }}
            onDragEnd={() => setDraggedTileId(null)}
          />
        ))}
        </div>
      </div>

      <div className="flex shrink-0 justify-center gap-2 sm:gap-3">
        <Control icon={audio ? "mic" : "mic-off"} label={audio ? "Mute" : "Unmute"} onClick={() => toggle("audio")} />
        <Control icon={video ? "camera" : "camera-off"} label={video ? "Camera off" : "Camera on"} onClick={() => toggle("video")} />
        <button
          onClick={onLeave}
          className="flex min-w-20 flex-col items-center gap-1 border-[var(--border-default)] bg-[var(--color-danger)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:min-w-24 sm:px-4 sm:py-2.5 sm:text-[11px]"
        >
          <CallIcon name="end" className="h-5 w-5" />
          Leave
        </button>
      </div>

      {leavePromptOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-overlay)] p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xl)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-danger)]">Leave room</p>
            <h2 className="mt-2 text-lg font-black text-[var(--color-text-primary)]">Leave this room?</h2>
            <p className="mt-2 text-sm leading-5 text-[var(--color-text-secondary)]">Your camera and microphone will be disconnected from this room.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setLeavePromptOpen(false)} className="border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs font-bold text-[var(--color-text-primary)]">Stay</button>
              <button type="button" onClick={onLeave} className="border-[var(--border-default)] bg-[var(--color-danger)] px-3 py-2 text-xs font-bold text-white">Leave room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({
  name,
  stream,
  muted,
  audioMuted,
  mirror,
  draggable,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isSpotlight,
  onSpotlight,
}: {
  name: string;
  stream: MediaStream | null;
  muted: boolean;
  audioMuted?: boolean;
  mirror?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
  isSpotlight?: boolean;
  onSpotlight?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex ${isSpotlight ? "aspect-video max-h-[min(65vh,720px)]" : "aspect-video"} items-center justify-center overflow-hidden rounded-2xl border-[var(--border-default)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-150 ${isDragging ? "scale-[1.01] opacity-80" : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between rounded-t-2xl border-b-[var(--border-default)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        <span>{name === "You" ? "Local" : "Remote"}</span>
        <button
          type="button"
          aria-label={isSpotlight ? "Restore tile" : `Enlarge ${name}'s camera`}
          onClick={(event) => { event.stopPropagation(); onSpotlight?.(); }}
          className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-primary)]"
        >
          <CallIcon name={isSpotlight ? "shrink" : "expand"} className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className={`absolute right-3 top-12 flex max-w-[45%] items-center gap-1.5 rounded-full border-[var(--border-default)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${muted ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]" : "bg-[var(--color-success-muted)] text-[var(--color-success)]"}`}>
        <CallIcon name={muted ? "camera-off" : "camera"} className="h-3.5 w-3.5" />
        {muted ? "Camera off" : "Live"}
      </div>
      {audioMuted && (
        <div className="absolute left-3 top-12 flex items-center gap-1.5 border-[var(--border-default)] bg-[var(--color-danger-muted)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-danger)]">
          <CallIcon name="mic-off" className="h-3.5 w-3.5" />
          Muted
        </div>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={name === "You"}
        className={`h-full w-full object-cover pt-9 ${mirror ? "scale-x-[-1]" : ""} ${muted ? "hidden" : "block"}`}
      />
      {muted && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 pt-8 text-center text-sm font-bold text-[var(--color-text-secondary)]">
          <CallIcon name="camera-off" className="h-10 w-10" />
          Camera off
        </span>
      )}
      <span className="absolute bottom-3 left-1/2 max-w-[80%] -translate-x-1/2 rounded-full border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-1 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
        {name}
      </span>
    </div>
  );
}

function Control({ icon, label, onClick }: { icon: "mic" | "mic-off" | "camera" | "camera-off"; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-w-20 flex-col items-center gap-1 border-[var(--border-default)] bg-[var(--color-surface)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[var(--color-primary-muted)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:min-w-24 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.18em]"
    >
      <CallIcon name={icon} className="h-5 w-5" />
      {label}
    </button>
  );
}
