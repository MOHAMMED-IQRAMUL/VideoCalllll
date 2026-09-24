"use client";

import { useEffect, useState } from "react";
import VideoCall from "../components/VideoCall";
import VideoRooms from "../components/VideoRooms";
import CallIcon from "../components/CallIcon";
import type { Peer } from "../components/useCallRoom";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

type Feature = "video-calling" | "video-rooms";

interface NavItem {
  id: Feature;
  icon: string;
  label: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "video-calling",
    icon: "☎",
    label: "1-on-1 Video Calling",
    description: "Direct call with one person",
  },
  {
    id: "video-rooms",
    icon: "▣",
    label: "Video Rooms",
    description: "Join a room with multiple people",
  },
];

export default function CallPage() {
  const [active, setActive] = useState<Feature>("video-calling");
  const [name, setName] = useState("");
  const [user, setUser] = useState<Peer | null>(() => {
    if (typeof window === "undefined") return null;
    const savedId = window.localStorage.getItem("callkaro-id");
    const savedName = window.localStorage.getItem("callkaro-name");
    return savedId && savedName ? { id: savedId, name: savedName } : null;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [pendingFeature, setPendingFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (!user) return;
    const sessionId = window.sessionStorage.getItem("callkaro-session") ?? crypto.randomUUID();
    window.sessionStorage.setItem("callkaro-session", sessionId);
    const register = () => fetch(`${API_URL}/api/presence`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...user, sessionId }) }).catch(() => undefined);
    void register();
    const timer = window.setInterval(register, 20_000);
    const leave = () => { navigator.sendBeacon(`${API_URL}/api/presence`, new Blob([JSON.stringify({ sessionId })], { type: "application/json" })); };
    window.addEventListener("beforeunload", leave);
    return () => { window.clearInterval(timer); window.removeEventListener("beforeunload", leave); void fetch(`${API_URL}/api/presence`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) }); };
  }, [user]);

  const enter = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = window.localStorage.getItem("callkaro-id") ?? crypto.randomUUID();
    window.localStorage.setItem("callkaro-id", id);
    window.localStorage.setItem("callkaro-name", trimmed);
    setUser({ id, name: trimmed });
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            enter();
          }}
          className="w-full max-w-md border-[var(--border-default)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-lg)]"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            CallKaro
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--color-text-primary)]">
            What should people call you?
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            Your name is visible only while you are online.
          </p>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={40}
            placeholder="Your name"
            className="mt-6 w-full border-[var(--border-default)] bg-[var(--color-surface-raised)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-shadow duration-150 focus:shadow-[var(--shadow-focus)]"
          />
          <button className="mt-4 w-full border-[var(--border-default)] bg-[var(--color-primary)] px-4 py-3 text-sm font-bold shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Continue
          </button>
        </form>
      </main>
    );
  }

  const selectFeature = (next: Feature) => {
    if (next === active) return;
    if (sessionActive) {
      setPendingFeature(next);
      return;
    }
    setSessionActive(false);
    setActive(next);
  };

  const confirmFeatureSwitch = () => {
    if (!pendingFeature) return;
    setSessionActive(false);
    setActive(pendingFeature);
    setPendingFeature(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] font-sans">
      <aside
        className={`flex flex-col border-r-[var(--border-default)] bg-[var(--color-bg-secondary)] transition-all duration-150 ${
          sidebarCollapsed ? "w-20 min-w-[80px]" : "w-64 min-w-[256px]"
        } transition-[width] duration-300 ease-out`}
      >
        <div className="flex items-center justify-between border-b-[var(--border-default)] px-3 py-3">
          {!sidebarCollapsed ? (
            <span className="text-base font-black tracking-[-0.04em] text-[var(--color-text-primary)]">CallKaro</span>
          ) : (
            <span className="mx-auto text-lg font-black text-[var(--color-text-primary)]">C</span>
          )}
          <button
            type="button"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((value) => !value)}
            className="flex h-8 w-8 items-center justify-center border-[var(--border-default)] bg-[var(--color-surface)] p-1.5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-200 hover:scale-105 hover:shadow-[var(--shadow-md)]"
          >
            <CallIcon name={sidebarCollapsed ? "panel-open" : "panel-close"} className="h-full w-full" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-2 py-3">
          {!sidebarCollapsed && (
            <p className="mb-1 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              Features
            </p>
          )}

          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => selectFeature(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`flex w-full items-center gap-3 rounded-none border-[var(--border-default)] px-2 py-2.5 text-left transition-[background-color,transform] duration-200 hover:translate-x-0.5 ${
                active === item.id ? "bg-[var(--color-primary)] shadow-[var(--shadow-sm)]" : "bg-transparent hover:bg-[var(--color-primary-muted)]"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className="w-6 flex-shrink-0 text-center text-xl">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[var(--color-text-primary)]">
                    {item.label}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--color-text-secondary)]">
                    {item.description}
                  </span>
                </div>
              )}
              {!sidebarCollapsed && active === item.id && <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-text-primary)]" />}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 border-t-[var(--border-default)] px-5 py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Connected</span>
          </div>
        )}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b-[var(--border-default)] bg-[var(--color-surface)] px-4 py-4 sm:px-7">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="mb-2 inline-flex items-center gap-2 border-[var(--border-default)] bg-[var(--color-primary-muted)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] md:hidden"
            >
              <CallIcon name={sidebarCollapsed ? "panel-open" : "panel-close"} className="h-4 w-4" />
              <span>{sidebarCollapsed ? "Open panel" : "Hide panel"}</span>
            </button>
            <h1 className="text-lg font-black tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-xl">
              {NAV_ITEMS.find((n) => n.id === active)?.label}
            </h1>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="flex h-10 w-10 items-center justify-center border-[var(--border-default)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-transform duration-200 hover:scale-105 hover:shadow-[var(--shadow-md)]"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CallIcon name={sidebarCollapsed ? "panel-open" : "panel-close"} className="h-full w-full" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-[var(--color-bg)]">
          <div className="h-full overflow-auto">
            {active === "video-calling" && <VideoCall user={user} onLeave={() => setSessionActive(false)} onSessionChange={setSessionActive} />}
            {active === "video-rooms" && <VideoRooms user={user} onSessionChange={setSessionActive} />}
          </div>
        </div>
      </main>

      {pendingFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xl)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-warning)]">Active session</p>
            <h2 className="mt-2 text-lg font-black text-[var(--color-text-primary)]">Leave this call?</h2>
            <p className="mt-2 text-sm leading-5 text-[var(--color-text-secondary)]">Switching views will close your current call. The other person will be notified that you left.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPendingFeature(null)} className="border-[var(--border-default)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs font-bold text-[var(--color-text-primary)]">Stay</button>
              <button type="button" onClick={confirmFeatureSwitch} className="border-[var(--border-default)] bg-[var(--color-danger)] px-3 py-2 text-xs font-bold text-white">Leave and switch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}