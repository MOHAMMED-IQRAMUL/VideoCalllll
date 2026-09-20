"use client";

import { useEffect, useRef, useState } from "react";
import { Peer, useCallRoom } from "./useCallRoom";
import CallIcon from "./CallIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
const USER_CACHE_KEY = "callkaro-online-users";
const USER_CACHE_TTL = 60 * 60 * 1000;
type CallInvite = { callId: string; callerId: string; callerName: string; calleeId: string; calleeName: string; status: "pending" | "accepted" | "rejected" | "ended" };

function readCachedUsers(currentUserId: string): Peer[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return [];
    const cached = JSON.parse(raw) as { savedAt?: number; users?: Peer[] };
    if (!cached.savedAt || Date.now() - cached.savedAt > USER_CACHE_TTL || !Array.isArray(cached.users)) return [];
    return cached.users.filter((person) => person.id !== currentUserId);
  } catch {
    return [];
  }
}

export default function VideoCall({ user, onLeave, onSessionChange }: { user: Peer; onLeave: () => void; onSessionChange: (active: boolean) => void }) {
  const [onlineUsers, setOnlineUsers] = useState<Peer[]>([]);
  const [target, setTarget] = useState<Peer | null>(null);
  const [callPhase, setCallPhase] = useState<"outgoing" | "incoming" | "connected">("outgoing");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallInvite | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callNotice, setCallNotice] = useState<{ title: string; message: string } | null>(null);
  const activeCallIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  const endCallRecord = (callId: string | null) => {
    if (!callId) return;
    void fetch(`${API_URL}/api/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "end", callId, callerId: user.id }),
    });
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
    mountedRef.current = false;
    endCallRecord(activeCallIdRef.current);
    };
  }, [user.id]);

  const loadUsers = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/api/presence`);
      const users = (await response.json()) as Peer[];
      const visibleUsers = users.filter((item) => item.id !== user.id);
      setOnlineUsers(visibleUsers);
      window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), users: visibleUsers }));
    } catch {
      setOnlineUsers(readCachedUsers(user.id));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setOnlineUsers(readCachedUsers(user.id));
    void loadUsers();
    const timer = window.setInterval(() => {
      void loadUsers();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [user.id]);

  useEffect(() => {
    const checkCalls = async () => {
      try {
        const response = await fetch(`${API_URL}/api/calls?userId=${encodeURIComponent(user.id)}`);
        if (!response.ok) return;
        const calls = (await response.json()) as CallInvite[];
        const pending = calls.find((call) => call.calleeId === user.id && call.status === "pending");
        setIncomingCall(pending ?? null);
        const activeCall = activeCallId ? calls.find((call) => call.callId === activeCallId) : null;
        if (activeCall?.status === "rejected" || activeCall?.status === "ended") {
          setCallNotice({
            title: activeCall.status === "rejected" ? "Call declined" : "Call ended",
            message: activeCall.status === "rejected" ? `${activeCall.calleeName} declined the call.` : "The other participant ended the call.",
          });
          activeCallIdRef.current = null;
          setActiveCallId(null);
          setTarget(null);
          setCallPhase("outgoing");
          onSessionChange(false);
          window.setTimeout(() => setCallNotice(null), 4500);
        }
      } catch {
        // Presence and calling remain usable when the polling request is temporarily unavailable.
      }
    };
    void checkCalls();
    const timer = window.setInterval(() => void checkCalls(), 2000);
    return () => window.clearInterval(timer);
  }, [activeCallId, target, user.id]);

  const startCall = async (person: Peer) => {
    setCallPhase("outgoing");
    setTarget(person);
    onSessionChange(true);
    try {
      const response = await fetch(`${API_URL}/api/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", callerId: user.id, callerName: user.name, calleeId: person.id, calleeName: person.name }),
      });
      if (response.ok) {
        const invite = (await response.json()) as CallInvite;
        if (!mountedRef.current) {
          endCallRecord(invite.callId);
          return;
        }
        activeCallIdRef.current = invite.callId;
        setActiveCallId(invite.callId);
      }
    } catch {
      // WebRTC still attempts to connect if the invite request is unavailable.
    }
  };

  const answerCall = async (accept: boolean) => {
    if (!incomingCall) return;
    const invite = incomingCall;
    setIncomingCall(null);
    if (accept) {
      if (target && activeCallIdRef.current) {
        endCallRecord(activeCallIdRef.current);
        activeCallIdRef.current = null;
        setActiveCallId(null);
      }
      setCallPhase("incoming");
      setTarget({ id: invite.callerId, name: invite.callerName });
      activeCallIdRef.current = invite.callId;
      setActiveCallId(invite.callId);
      onSessionChange(true);
    } else {
      setCallNotice({ title: "Call declined", message: `You declined ${invite.callerName}'s call.` });
      window.setTimeout(() => setCallNotice(null), 4500);
    }
    const response = await fetch(`${API_URL}/api/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: accept ? "accept" : "reject", callId: invite.callId, calleeId: user.id }),
    }).catch(() => undefined);
    if (!response?.ok && accept) {
      endCallRecord(invite.callId);
      activeCallIdRef.current = null;
      setActiveCallId(null);
      setTarget(null);
      onSessionChange(false);
      setCallNotice({ title: "Could not join", message: "The call invitation could not be accepted." });
      window.setTimeout(() => setCallNotice(null), 4500);
    }
  };

  if (!target) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto bg-[var(--color-bg)] p-3 sm:gap-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 border-[var(--border-default)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Directory</p>
            <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-[var(--color-text-primary)]">People online</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border-[var(--border-default)] bg-[var(--color-primary-muted)] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
              <span className="inline-flex h-6 w-6 items-center justify-center border-[var(--border-default)] bg-[var(--color-primary)] text-base">📞</span>
              {onlineUsers.length}
            </div>

            <button
              type="button"
              onClick={() => void loadUsers()}
              className="flex items-center gap-2 border-[var(--border-default)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <span className="text-base">↻</span>
              {isRefreshing ? "Checking..." : "Refresh"}
            </button>
          </div>
        </div>

        {callNotice && (
          <div role="status" className="flex shrink-0 items-start gap-3 rounded-xl border-[var(--border-default)] bg-[var(--color-warning-muted)] p-3 shadow-[var(--shadow-sm)]">
            <CallIcon name="incoming" className="h-5 w-5 shrink-0 text-[var(--color-warning)]" />
            <div className="min-w-0">
              <p className="text-xs font-black text-[var(--color-text-primary)]">{callNotice.title}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{callNotice.message}</p>
            </div>
            <button type="button" onClick={() => setCallNotice(null)} aria-label="Dismiss notification" className="ml-auto text-sm font-bold text-[var(--color-text-secondary)]">×</button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {onlineUsers.map((person) => (
            <button
              key={person.id}
              onClick={() => void startCall(person)}
              className="flex items-center justify-between border-[var(--border-default)] bg-[var(--color-surface)] px-4 py-3 text-left shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border-[var(--border-default)] bg-[var(--color-primary-soft)] text-base">👤</span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">{person.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">online</span>
                </span>
              </span>
              <span className="flex items-center gap-2 border-[var(--border-default)] bg-[var(--color-primary)] px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                <span className="text-base">📞</span>
                Call
              </span>
            </button>
          ))}
        </div>

        {onlineUsers.length === 0 && (
          <div className="space-y-3">
            <div className="border-[2px dashed #d0d1cb] bg-[var(--color-surface)] p-7 text-center">
              <p className="text-sm font-bold text-[var(--color-text-primary)]">No one is online right now</p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">Use the refresh button to check again or invite someone to join.</p>
            </div>
            <NotificationToast tone="info" title="Waiting for connection" message="Refresh to check for active users." />
          </div>
        )}

        {incomingCall && (
          <div className="border-[var(--border-default)] bg-[var(--color-primary-muted)] p-4 shadow-[var(--shadow-md)]">
            <NotificationToast tone="info" title="Incoming call" message={`${incomingCall.callerName} is calling you.`} />
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => void answerCall(true)} className="border-[var(--border-default)] bg-[var(--color-success)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[var(--shadow-sm)]">Accept call</button>
              <button type="button" onClick={() => void answerCall(false)} className="border-[var(--border-default)] bg-[var(--color-danger)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[var(--shadow-sm)]">Decline</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const roomId = [user.id, target.id].sort().join(":");
  const leaveCall = () => {
    endCallRecord(activeCallIdRef.current ?? activeCallId);
    activeCallIdRef.current = null;
    setActiveCallId(null);
    setTarget(null);
    setCallPhase("outgoing");
    onLeave();
    onSessionChange(false);
  };
  return (
    <CallSurface
      user={user}
      roomId={roomId}
      label={target.name}
      peerId={target.id}
      phase={callPhase}
      onlineUsers={onlineUsers}
      incomingCall={incomingCall}
      onAnswerCall={answerCall}
      onLeave={leaveCall}
    />
  );
}

function CallSignalCard({ tone, title, subtitle }: { tone: "incoming" | "outgoing" | "live"; title: string; subtitle: string }) {
  const iconMap = {
    incoming: "📞",
    outgoing: "📱",
    live: "📹",
  };

  const bgMap = {
    incoming: "bg-[var(--color-primary-muted)]",
    outgoing: "bg-[var(--color-bg-secondary)]",
    live: "bg-[var(--color-success-muted)]",
  };

  return (
    <div className={`border-[var(--border-default)] ${bgMap[tone]} p-3 shadow-[var(--shadow-sm)]`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center border-[var(--border-default)] bg-[var(--color-surface-raised)] text-lg">
          {iconMap[tone]}
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{title}</p>
          <p className="text-sm font-bold text-[var(--color-text-primary)]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function NotificationToast({ tone, title, message }: { tone: "info" | "success" | "warning"; title: string; message: string }) {
  const toneMap = {
    info: { bg: "bg-[var(--color-primary-soft)]", icon: "📌", label: "Info" },
    success: { bg: "bg-[var(--color-success-muted)]", icon: "✓", label: "Success" },
    warning: { bg: "bg-[var(--color-warning-muted)]", icon: "⚠", label: "Warning" },
  };

  return (
    <div className={`flex items-start gap-3 border-[var(--border-default)] ${toneMap[tone].bg} p-3 shadow-[var(--shadow-sm)]`}>
      <span className="flex h-9 w-9 items-center justify-center border-[var(--border-default)] bg-[var(--color-surface-raised)] text-base">
        {toneMap[tone].icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">{toneMap[tone].label}</p>
        <p className="text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
        <p className="text-xs leading-5 text-[var(--color-text-secondary)]">{message}</p>
      </div>
    </div>
  );
}

function CallSurface({ user, roomId, label, peerId, phase, onlineUsers, incomingCall, onAnswerCall, onLeave }: { user: Peer; roomId: string; label: string; peerId: string; phase: "outgoing" | "incoming" | "connected"; onlineUsers: Peer[]; incomingCall: CallInvite | null; onAnswerCall: (accept: boolean) => Promise<void>; onLeave: () => void }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [leavePromptOpen, setLeavePromptOpen] = useState(false);
  const [tileOrder, setTileOrder] = useState<("local" | "remote")[]>(["remote", "local"]);
  const [draggedTile, setDraggedTile] = useState<"local" | "remote" | null>(null);
  const hadRemotePeerRef = useRef(false);
  const call = useCallRoom({ roomId, user, roomType: "direct" });
  const effectivePhase = Object.keys(call.remoteStreams).length > 0 ? "connected" : phase;
  const remoteJoined = call.peers.some((peer) => peer.id === peerId);
  useEffect(() => {
    if (remoteJoined) hadRemotePeerRef.current = true;
  }, [remoteJoined]);
  const remotePlaceholder = remoteJoined ? "Camera off" : hadRemotePeerRef.current ? "Left the call" : "Not joined yet";

  useEffect(() => {
    if (localVideoRef.current && call.localStream) localVideoRef.current.srcObject = call.localStream;
  }, [call.localStream]);

  useEffect(() => {
    const stream = Object.values(call.remoteStreams)[0];
    if (remoteVideoRef.current && stream) remoteVideoRef.current.srcObject = stream;
  }, [call.remoteStreams]);

  const reorderTiles = (from: "local" | "remote", to: "local" | "remote") => {
    if (from === to) return;
    setTileOrder((current) => {
      const next = [...current];
      const fromIndex = next.indexOf(from);
      const toIndex = next.indexOf(to);
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

  const orderedTiles = tileOrder.map((id) => ({
    id,
    element:
      id === "local" ? (
        <VideoTile
          key="local"
          videoRef={localVideoRef}
          name="You"
          muted={!video}
          audioMuted={!audio}
          mirror
          draggable
          isDragging={draggedTile === "local"}
          onDragStart={() => setDraggedTile("local")}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggedTile) reorderTiles(draggedTile, "local");
            setDraggedTile(null);
          }}
          onDragEnd={() => setDraggedTile(null)}
        />
      ) : (
        <VideoTile
          key="remote"
          videoRef={remoteVideoRef}
          name={label}
          muted={!Object.keys(call.remoteStreams).length || call.mediaStates[peerId]?.video === false}
          audioMuted={call.mediaStates[peerId]?.audio === false}
          placeholderText={remotePlaceholder}
          draggable
          isDragging={draggedTile === "remote"}
          onDragStart={() => setDraggedTile("remote")}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggedTile) reorderTiles(draggedTile, "remote");
            setDraggedTile(null);
          }}
          onDragEnd={() => setDraggedTile(null)}
        />
      ),
  }));

  const statusText = effectivePhase === "incoming" ? "Incoming call" : effectivePhase === "outgoing" ? "Calling…" : call.connected ? "Connected" : "Connecting...";
  const phaseIcon = effectivePhase === "incoming" ? "incoming" : effectivePhase === "outgoing" ? "outgoing" : "call";
  const statusTone = effectivePhase === "incoming" ? "bg-[var(--color-primary-muted)]" : effectivePhase === "outgoing" ? "bg-[var(--color-bg-secondary)]" : "bg-[var(--color-success-muted)]";

  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden bg-[var(--color-bg)] p-2 sm:gap-3 sm:p-4">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
      <div className={`flex items-center justify-between border-[var(--border-default)] ${statusTone} px-3 py-2.5 shadow-[var(--shadow-sm)]`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center border-[var(--border-default)] bg-[var(--color-surface-raised)] p-2.5">
            <CallIcon name={phaseIcon} className="h-full w-full" />
          </span>
          <div>
            <p className="text-sm font-black tracking-[-0.04em] text-[var(--color-text-primary)]">{label}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{statusText}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">1-on-1</span>
      </div>

      <div className="grid min-h-0 flex-1 auto-rows-min gap-3 overflow-y-auto md:grid-cols-2 md:auto-rows-auto">
        {orderedTiles.map((tile) => tile.element)}
      </div>

      <div className="flex shrink-0 justify-center gap-2 sm:gap-3">
        <ControlButton icon={audio ? "mic" : "mic-off"} label={audio ? "Mute" : "Unmute"} onClick={() => toggle("audio")} />
        <ControlButton icon={video ? "camera" : "camera-off"} label={video ? "Camera off" : "Camera on"} onClick={() => toggle("video")} />
        <button
          onClick={() => setLeavePromptOpen(true)}
          className="flex min-w-20 flex-col items-center gap-1 border-[var(--border-default)] bg-[var(--color-danger)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:min-w-24 sm:px-4 sm:py-2.5 sm:text-xs"
        >
          <CallIcon name="end" className="h-5 w-5" />
          End call
        </button>
      </div>
      </div>

      <CallSidePanel
        open={sidePanelOpen}
        onToggle={() => setSidePanelOpen((value) => !value)}
        onlineUsers={onlineUsers}
        incomingCall={incomingCall}
        onAnswerCall={onAnswerCall}
      />

      {leavePromptOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-overlay)] p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xl)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-danger)]">End call</p>
            <h2 className="mt-2 text-lg font-black text-[var(--color-text-primary)]">Leave this conversation?</h2>
            <p className="mt-2 text-sm leading-5 text-[var(--color-text-secondary)]">The call will close for you and the other participant.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setLeavePromptOpen(false)} className="border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs font-bold text-[var(--color-text-primary)]">Stay</button>
              <button type="button" onClick={onLeave} className="border-[var(--border-default)] bg-[var(--color-danger)] px-3 py-2 text-xs font-bold text-white">End call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CallSidePanel({ open, onToggle, onlineUsers, incomingCall, onAnswerCall }: { open: boolean; onToggle: () => void; onlineUsers: Peer[]; incomingCall: CallInvite | null; onAnswerCall: (accept: boolean) => Promise<void> }) {
  return (
    <aside className={`flex max-h-full shrink-0 flex-col overflow-hidden border-[var(--border-default)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-[width] duration-300 ${open ? "w-56 p-2 sm:w-64 sm:p-3" : "w-10 p-1.5 sm:w-11"}`}>
      <button type="button" onClick={onToggle} aria-label={open ? "Collapse call panel" : "Open call panel"} className="flex h-8 w-full items-center justify-center rounded-lg border-[var(--border-default)] bg-[var(--color-primary-muted)] text-[var(--color-text-primary)]">
        <CallIcon name={open ? "panel-open" : "panel-close"} className="h-4 w-4" />
        {open && <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em]">Activity</span>}
      </button>
      {open && (
        <div className="mt-3 min-h-0 space-y-4 overflow-y-auto">
          {incomingCall && (
            <div className="rounded-xl border-[var(--border-default)] bg-[var(--color-primary-muted)] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-warning)]">Incoming call</p>
              <p className="mt-1 truncate text-sm font-bold text-[var(--color-text-primary)]">{incomingCall.callerName}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => void onAnswerCall(true)} className="rounded-lg border-[var(--border-default)] bg-[var(--color-success)] px-2 py-1.5 text-[10px] font-bold text-white">Accept</button>
                <button type="button" onClick={() => void onAnswerCall(false)} className="rounded-lg border-[var(--border-default)] bg-[var(--color-danger)] px-2 py-1.5 text-[10px] font-bold text-white">Decline</button>
              </div>
            </div>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">Online users</p>
            <div className="mt-2 space-y-1.5">
              {onlineUsers.map((person) => <div key={person.id} className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-secondary)] px-2.5 py-2 text-xs font-bold text-[var(--color-text-primary)]"><span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />{person.name}</div>)}
              {onlineUsers.length === 0 && <p className="text-xs text-[var(--color-text-secondary)]">No other users online.</p>}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function VideoTile({
  videoRef,
  name,
  muted,
  audioMuted,
  placeholderText,
  mirror,
  draggable,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  name: string;
  muted: boolean;
  audioMuted?: boolean;
  placeholderText?: string;
  mirror?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
}) {
  const videoStatus = placeholderText === "Not joined yet" ? "Not joined" : placeholderText === "Left the call" ? "Left" : muted ? "Camera off" : "Live";

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border-[var(--border-default)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-150 ${isDragging ? "scale-[1.01] opacity-80" : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between rounded-t-2xl border-b-[var(--border-default)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        <span>{name === "You" ? "Local" : "Remote"}</span>
        <span>{draggable ? "drag" : "live"}</span>
      </div>
      <div className={`absolute right-3 top-12 flex max-w-[45%] items-center gap-1.5 rounded-full border-[var(--border-default)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${muted ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]" : "bg-[var(--color-success-muted)] text-[var(--color-success)]"}`}>
        <CallIcon name={muted ? "camera-off" : "camera"} className="h-3.5 w-3.5" />
        {videoStatus}
      </div>
      {audioMuted && (
        <div className="absolute left-3 top-12 flex items-center gap-1.5 border-[var(--border-default)] bg-[var(--color-danger-muted)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-danger)]">
          <CallIcon name="mic-off" className="h-3.5 w-3.5" />
          Muted
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={name === "You"}
        className={`h-full w-full object-cover pt-9 ${mirror ? "scale-x-[-1]" : ""} ${muted ? "hidden" : "block"}`}
      />
      {muted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 pt-8 text-center text-sm font-bold text-[var(--color-text-secondary)]">
          <CallIcon name="camera-off" className="h-10 w-10" />
          <span>{placeholderText ?? `${name} camera is off`}</span>
        </div>
      )}
      <span className="absolute bottom-3 left-1/2 max-w-[80%] -translate-x-1/2 rounded-full border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-1 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
        {name}
      </span>
    </div>
  );
}

function ControlButton({ icon, label, onClick }: { icon: "mic" | "mic-off" | "camera" | "camera-off"; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-w-20 flex-col items-center gap-1 border-[var(--border-default)] bg-[var(--color-surface)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:bg-[var(--color-primary-muted)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:min-w-24 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.18em]"
    >
      <CallIcon name={icon} className="h-5 w-5" />
      {label}
    </button>
  );
}
