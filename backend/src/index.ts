/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { DurableObject } from "cloudflare:workers";

const PRESENCE_TTL_MS = 45_000;
const MAX_NAME_LENGTH = 40;

type PresenceUser = { id: string; name: string };
type ConnectionState = PresenceUser & { sessionId: string };
type SignalMessage = { type: "signal" | "media-state"; to?: string; payload?: unknown };
type CallInvite = {
	callId: string;
	callerId: string;
	callerName: string;
	calleeId: string;
	calleeName: string;
	status: "pending" | "accepted" | "rejected" | "ended";
	createdAt: number;
	expiresAt: number;
};

const json = (body: unknown, init?: ResponseInit) => new Response(JSON.stringify(body), {
	...init,
	headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...(init?.headers ?? {}) },
});

function cleanName(value: unknown) {
	return typeof value === "string" ? value.trim().slice(0, MAX_NAME_LENGTH) : "";
}

async function ensurePresenceTable(db: D1Database) {
	await db.prepare(`CREATE TABLE IF NOT EXISTS online_users (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		session_id TEXT NOT NULL UNIQUE,
		expires_at INTEGER NOT NULL
	)`).run();
}

async function ensureCallsTable(db: D1Database) {
	await db.prepare(`CREATE TABLE IF NOT EXISTS call_invites (
		call_id TEXT PRIMARY KEY,
		caller_id TEXT NOT NULL,
		caller_name TEXT NOT NULL,
		callee_id TEXT NOT NULL,
		callee_name TEXT NOT NULL,
		status TEXT NOT NULL,
		created_at INTEGER NOT NULL,
		expires_at INTEGER NOT NULL
	)`).run();
}

async function ensureRoomPresenceTable(db: D1Database) {
	await db.prepare(`CREATE TABLE IF NOT EXISTS room_presence (
		room_id TEXT NOT NULL,
		id TEXT NOT NULL,
		name TEXT NOT NULL,
		PRIMARY KEY (room_id, id)
	)`).run();
}

export class CallRoom extends DurableObject<Env> {
	private readonly roomEnv: Env;
	private roomId = "";
	private roomType: "direct" | "room" = "room";

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.roomEnv = env;
		ctx.blockConcurrencyWhile(async () => {
			this.ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS participants (
				id TEXT PRIMARY KEY, name TEXT NOT NULL, session_id TEXT NOT NULL UNIQUE
			)`);
		});
	}

	async fetch(request: Request) {
		const url = new URL(request.url);
		this.roomId = url.searchParams.get("room")?.trim() ?? this.roomId;
		this.roomType = url.searchParams.get("kind") === "direct" ? "direct" : "room";
		if (url.pathname !== "/websocket" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return new Response("Expected a WebSocket upgrade", { status: 426 });
		const id = url.searchParams.get("id")?.trim();
		const name = cleanName(url.searchParams.get("name"));
		const sessionId = url.searchParams.get("session")?.trim();
		if (!id || !name || !sessionId) return new Response("Missing participant details", { status: 400 });

		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		this.ctx.acceptWebSocket(server);
		server.serializeAttachment({ id, name, sessionId } satisfies ConnectionState);
		const peers = this.ctx.storage.sql.exec<ConnectionState>("SELECT id, name, session_id as sessionId FROM participants WHERE id != ?", id).toArray();
		this.ctx.storage.sql.exec("INSERT OR REPLACE INTO participants (id, name, session_id) VALUES (?, ?, ?)", id, name, sessionId);
		if (this.roomType === "room") {
			await ensureRoomPresenceTable(this.roomEnv.DB);
			await this.roomEnv.DB.prepare("INSERT OR REPLACE INTO room_presence (room_id, id, name) VALUES (?, ?, ?)").bind(`room:${this.roomId}`, id, name).run();
		}
		server.send(JSON.stringify({ type: "room-state", peers }));
		this.broadcast({ type: "participant-joined", participant: { id, name } }, server);
		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
		if (typeof raw !== "string") return;
		let message: SignalMessage;
		try { message = JSON.parse(raw) as SignalMessage; } catch { return; }
		const sender = ws.deserializeAttachment() as ConnectionState;
		if (message.type === "signal" && message.to && message.payload !== undefined) this.sendTo(message.to, { type: "signal", from: sender.id, payload: message.payload });
		if (message.type === "media-state") this.broadcast({ type: "media-state", from: sender.id, payload: message.payload }, ws);
	}

	async webSocketClose(ws: WebSocket) {
		const participant = ws.deserializeAttachment() as ConnectionState | null;
		if (!participant) return;
		this.ctx.storage.sql.exec("DELETE FROM participants WHERE session_id = ?", participant.sessionId);
		if (this.roomId && this.roomType === "room") {
			await ensureRoomPresenceTable(this.roomEnv.DB);
			await this.roomEnv.DB.prepare("DELETE FROM room_presence WHERE room_id = ? AND id = ?").bind(`room:${this.roomId}`, participant.id).run();
		}
		this.broadcast({ type: "participant-left", id: participant.id }, ws);
		ws.close();
	}

	async webSocketError(ws: WebSocket) { ws.close(); }

	private sendTo(id: string, message: unknown) {
		for (const socket of this.ctx.getWebSockets()) {
			const participant = socket.deserializeAttachment() as ConnectionState | null;
			if (participant?.id === id && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
		}
	}

	private broadcast(message: unknown, except?: WebSocket) {
		const encoded = JSON.stringify(message);
		for (const socket of this.ctx.getWebSockets()) if (socket !== except && socket.readyState === WebSocket.OPEN) socket.send(encoded);
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS" } });
		if (url.pathname === "/health") return json({ ok: true });
		if (url.pathname === "/api/presence" && request.method === "POST") {
			const body = await request.json<{ id?: string; name?: string; sessionId?: string }>();
			const id = body.id?.trim(); const name = cleanName(body.name); const sessionId = body.sessionId?.trim();
			if (!id || !name || !sessionId) return json({ error: "id, name and sessionId are required" }, { status: 400 });
			await ensurePresenceTable(env.DB);
			const expiresAt = Date.now() + PRESENCE_TTL_MS;
			await env.DB.prepare("INSERT OR REPLACE INTO online_users (id, name, session_id, expires_at) VALUES (?, ?, ?, ?)").bind(id, name, sessionId, expiresAt).run();
			return json({ ok: true, expiresAt });
		}
		if (url.pathname === "/api/presence" && request.method === "GET") {
			await ensurePresenceTable(env.DB); const now = Date.now();
			const result = await env.DB.prepare("SELECT id, name FROM online_users WHERE expires_at > ? ORDER BY name COLLATE NOCASE").bind(now).all<PresenceUser>();
			ctx.waitUntil(env.DB.prepare("DELETE FROM online_users WHERE expires_at <= ?").bind(now).run());
			return json(result.results);
		}
		if (url.pathname === "/api/presence" && request.method === "DELETE") {
			const body = await request.json<{ sessionId?: string }>();
			if (body.sessionId) { await ensurePresenceTable(env.DB); await env.DB.prepare("DELETE FROM online_users WHERE session_id = ?").bind(body.sessionId).run(); }
			return json({ ok: true });
		}
		if (url.pathname === "/api/calls" && request.method === "POST") {
			const body = await request.json<Partial<CallInvite> & { action?: "invite" | "accept" | "reject" | "end" }>();
			await ensureCallsTable(env.DB);
			const now = Date.now();
			if (body.action === "invite") {
				const callerId = body.callerId?.trim(); const callerName = cleanName(body.callerName);
				const calleeId = body.calleeId?.trim(); const calleeName = cleanName(body.calleeName);
				if (!callerId || !callerName || !calleeId || !calleeName) return json({ error: "caller and callee details are required" }, { status: 400 });
				await env.DB.prepare("UPDATE call_invites SET status = 'ended' WHERE status = 'pending' AND ((caller_id = ? AND callee_id = ?) OR (caller_id = ? AND callee_id = ?))").bind(callerId, calleeId, calleeId, callerId).run();
				const call: CallInvite = { callId: crypto.randomUUID(), callerId, callerName, calleeId, calleeName, status: "pending", createdAt: now, expiresAt: now + 60_000 };
				await env.DB.prepare("INSERT INTO call_invites (call_id, caller_id, caller_name, callee_id, callee_name, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(call.callId, call.callerId, call.callerName, call.calleeId, call.calleeName, call.status, call.createdAt, call.expiresAt).run();
				return json(call, { status: 201 });
			}
			if ((body.action === "accept" || body.action === "reject") && body.callId && body.calleeId) {
				const status = body.action === "accept" ? "accepted" : "rejected";
				await env.DB.prepare("UPDATE call_invites SET status = ? WHERE call_id = ? AND callee_id = ? AND status = 'pending'").bind(status, body.callId, body.calleeId).run();
				return json({ ok: true, status });
			}
			if (body.action === "end" && body.callId && (body.callerId || body.calleeId)) {
				const userId = body.callerId ?? body.calleeId;
				await env.DB.prepare("UPDATE call_invites SET status = 'ended' WHERE call_id = ? AND (caller_id = ? OR callee_id = ?)").bind(body.callId, userId, userId).run();
				return json({ ok: true, status: "ended" });
			}
			return json({ error: "invalid call action" }, { status: 400 });
		}
		if (url.pathname === "/api/calls" && request.method === "GET") {
			const userId = url.searchParams.get("userId")?.trim();
			if (!userId) return json({ error: "userId is required" }, { status: 400 });
			await ensureCallsTable(env.DB);
			const now = Date.now();
			const result = await env.DB.prepare("SELECT call_id as callId, caller_id as callerId, caller_name as callerName, callee_id as calleeId, callee_name as calleeName, status, created_at as createdAt, expires_at as expiresAt FROM call_invites WHERE (callee_id = ? OR caller_id = ?) AND expires_at > ? AND status IN ('pending', 'accepted', 'rejected') ORDER BY created_at DESC LIMIT 10").bind(userId, userId, now).all<CallInvite>();
			ctx.waitUntil(env.DB.prepare("DELETE FROM call_invites WHERE expires_at <= ?").bind(now).run());
			return json(result.results);
		}
		if (url.pathname === "/api/calls" && request.method === "DELETE") {
			const callId = url.searchParams.get("callId")?.trim(); const userId = url.searchParams.get("userId")?.trim();
			if (callId && userId) { await ensureCallsTable(env.DB); await env.DB.prepare("DELETE FROM call_invites WHERE call_id = ? AND (caller_id = ? OR callee_id = ?)").bind(callId, userId, userId).run(); }
			return json({ ok: true });
		}
		if (url.pathname === "/api/rooms" && request.method === "GET") {
			await ensureRoomPresenceTable(env.DB);
			const result = await env.DB.prepare("SELECT substr(room_id, 6) as roomId, id, name FROM room_presence WHERE room_id LIKE 'room:%' ORDER BY room_id, name COLLATE NOCASE").all<{ roomId: string; id: string; name: string }>();
			const rooms = new Map<string, { roomId: string; users: PresenceUser[] }>();
			for (const member of result.results) {
				const room = rooms.get(member.roomId) ?? { roomId: member.roomId, users: [] };
				room.users.push({ id: member.id, name: member.name });
				rooms.set(member.roomId, room);
			}
			return json([...rooms.values()]);
		}
		if (url.pathname.startsWith("/ws/") && request.method === "GET") {
			if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return new Response("Expected a WebSocket upgrade", { status: 426 });
			const roomId = decodeURIComponent(url.pathname.slice(4)).trim();
			if (!roomId || roomId.length > 120) return new Response("Invalid room", { status: 400 });
			const roomUrl = new URL(request.url); roomUrl.pathname = "/websocket";
			roomUrl.searchParams.set("room", roomId);
			roomUrl.searchParams.set("kind", url.searchParams.get("kind") === "direct" ? "direct" : "room");
			return env.CALL_ROOM.getByName(roomId).fetch(new Request(roomUrl, request));
		}
		return json({ error: "Not found" }, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
