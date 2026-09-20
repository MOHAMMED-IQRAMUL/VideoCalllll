"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Peer = { id: string; name: string };
export type MediaState = { audio: boolean; video: boolean };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

function socketUrl(roomId: string, id: string, name: string, sessionId: string, roomType: "direct" | "room") {
  const url = new URL(`/ws/${encodeURIComponent(roomId)}`, API_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set("id", id);
  url.searchParams.set("name", name);
  url.searchParams.set("session", sessionId);
  url.searchParams.set("kind", roomType);
  return url.toString();
}

export function useCallRoom({ roomId, user, roomType = "room" }: { roomId: string; user: Peer; roomType?: "direct" | "room" }) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [mediaStates, setMediaStates] = useState<Record<string, MediaState>>({});
  const [connected, setConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peersRef = useRef<Peer[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const sessionIdRef = useRef(crypto.randomUUID());

  const send = useCallback((message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(message));
  }, []);

  const closePeer = useCallback((id: string) => {
    connectionsRef.current[id]?.close();
    delete connectionsRef.current[id];
    setRemoteStreams((current) => { const next = { ...current }; delete next[id]; return next; });
    setMediaStates((current) => { const next = { ...current }; delete next[id]; return next; });
  }, []);

  const ensurePeer = useCallback((peer: Peer) => {
    if (connectionsRef.current[peer.id]) return connectionsRef.current[peer.id];
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    connectionsRef.current[peer.id] = connection;
    localStreamRef.current?.getTracks().forEach((track) => connection.addTrack(track, localStreamRef.current as MediaStream));
    connection.onicecandidate = (event) => {
      if (event.candidate) send({ type: "signal", to: peer.id, payload: { candidate: event.candidate } });
    };
    connection.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) setRemoteStreams((current) => ({ ...current, [peer.id]: stream }));
    };
    connection.onconnectionstatechange = () => {
      if (["failed", "closed", "disconnected"].includes(connection.connectionState)) closePeer(peer.id);
    };
    return connection;
  }, [closePeer, send]);

  const offerPeer = useCallback(async (peer: Peer) => {
    const connection = ensurePeer(peer);
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    send({ type: "signal", to: peer.id, payload: { description: connection.localDescription } });
  }, [ensurePeer, send]);

  useEffect(() => {
    let active = true;
    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!active) { stream.getTracks().forEach((track) => track.stop()); return; }
      localStreamRef.current = stream;
      setLocalStream(stream);
      const socket = new WebSocket(socketUrl(roomId, user.id, user.name, sessionIdRef.current, roomType));
      socketRef.current = socket;
      socket.onopen = () => setConnected(true);
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data) as { type: string; peers?: Peer[]; participant?: Peer; id?: string; from?: string; payload?: { description?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit } };
        if (message.type === "room-state") {
          const nextPeers = message.peers ?? [];
          peersRef.current = nextPeers;
          setPeers(nextPeers);
          nextPeers.filter((peer) => user.id < peer.id).forEach((peer) => void offerPeer(peer));
        } else if (message.type === "participant-joined" && message.participant) {
          peersRef.current = peersRef.current.some((peer) => peer.id === message.participant?.id) ? peersRef.current : [...peersRef.current, message.participant as Peer];
          setPeers(peersRef.current);
          if (user.id < message.participant.id) void offerPeer(message.participant);
        } else if (message.type === "participant-left" && message.id) {
          peersRef.current = peersRef.current.filter((peer) => peer.id !== message.id); setPeers(peersRef.current); closePeer(message.id);
        } else if (message.type === "media-state" && message.from && message.payload) {
          setMediaStates((current) => ({ ...current, [message.from as string]: message.payload as MediaState }));
        } else if (message.type === "signal" && message.from && message.payload) {
          const peer = peersRef.current.find((item) => item.id === message.from) ?? { id: message.from, name: "Guest" };
          const connection = ensurePeer(peer);
          if (message.payload.description) {
            await connection.setRemoteDescription(message.payload.description);
            if (message.payload.description.type === "offer") {
              const answer = await connection.createAnswer(); await connection.setLocalDescription(answer);
              send({ type: "signal", to: message.from, payload: { description: connection.localDescription } });
            }
          } else if (message.payload.candidate) await connection.addIceCandidate(message.payload.candidate);
        }
      };
      socket.onclose = () => setConnected(false);
    };
    void start().catch(() => setConnected(false));
    return () => {
      active = false;
      socketRef.current?.close();
      Object.values(connectionsRef.current).forEach((connection) => connection.close());
      connectionsRef.current = {};
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    };
  }, [closePeer, ensurePeer, offerPeer, roomId, roomType, send, user.id, user.name]);

  const setMedia = useCallback((kind: "audio" | "video", enabled: boolean) => {
    const tracks = kind === "audio" ? localStreamRef.current?.getAudioTracks() : localStreamRef.current?.getVideoTracks();
    tracks?.forEach((track) => { track.enabled = enabled; });
    send({ type: "media-state", payload: { [kind]: enabled } });
  }, [send]);

  return { localStream, peers, remoteStreams, mediaStates, connected, setMedia, close: () => socketRef.current?.close() };
}