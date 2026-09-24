"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text-primary)] md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between border-[var(--border-default)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)] md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-[var(--border-default)] bg-[var(--color-primary)] text-sm font-black">
              C
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                CallKaro
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/call")}
            className="border-[var(--border-default)] bg-[var(--color-primary)] px-4 py-2 text-sm font-bold shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Enter workspace
          </button>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            <span className="mb-6 inline-flex border-[var(--border-default)] bg-[var(--color-primary-muted)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
              Live communication
            </span>

            <h1 className="mb-5 text-5xl font-black leading-[0.96] tracking-[-0.05em] text-[var(--color-text-primary)] md:text-6xl lg:text-7xl">
              Ready when your people are.
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-8 text-[var(--color-text-secondary)]">
              Start quick video calls, build shared rooms, and keep conversations moving with a warmer, more tactile workspace.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push("/call")}
                className="border-[var(--border-default)] bg-[var(--color-primary)] px-6 py-3 text-base font-bold shadow-[var(--shadow-md)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Enter App
              </button>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Private calls · shared rooms · instant connections
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="relative rounded-[18px] border-[var(--border-default)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lg)]">
              <div className="mb-4 flex items-center justify-between border-b-[var(--border-default)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    Live
                  </span>
                </div>
                <span className="border-[var(--border-default)] bg-[var(--color-primary-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  workspace
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="min-h-[180px] border-[var(--border-default)] bg-[var(--color-bg-secondary)] p-3 shadow-[var(--shadow-sm)]">
                  <div className="flex h-full items-center justify-center bg-[var(--color-surface)] text-5xl">👤</div>
                </div>
                <div className="min-h-[180px] border-[var(--border-default)] bg-[var(--color-primary-soft)] p-3 shadow-[var(--shadow-yellow)]">
                  <div className="flex h-full items-center justify-center bg-[var(--color-surface)] text-5xl">👤</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-[var(--border-default)] bg-[var(--color-bg-secondary)] p-3 shadow-[var(--shadow-sm)]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    room ID
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-[-0.04em]">CALL-42</p>
                </div>
                <div className="border-[var(--border-default)] bg-[var(--color-primary)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Join
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t-[var(--border-default)] pt-8">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                The stack behind the call
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] md:text-3xl">
                Real-time, browser-first, Cloudflare-native.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
              Every layer has a clear job: the browser owns media, the Worker coordinates, and rooms stay lightweight.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Interface", value: "Next.js + React 19", detail: "Responsive controls and call workspace" },
              { label: "Transport", value: "WebRTC + WebSocket", detail: "Direct media with fast signaling" },
              { label: "Runtime", value: "Workers + D1 + DO", detail: "Edge APIs, presence, and rooms" },
            ].map((item) => (
              <article key={item.label} className="border-[var(--border-default)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-transform duration-150 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">{item.label}</p>
                <h3 className="mt-4 text-xl font-black tracking-[-0.04em]">{item.value}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-10 pt-8 md:grid-cols-2">
          <article className="border-[var(--border-default)] bg-[var(--color-secondary)] p-6 text-[var(--color-text-inverse)] shadow-[var(--shadow-md)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">01 / Direct calls</p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">Find a person. Start a conversation.</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-inverse)] opacity-75">Presence, invites, acceptance, and peer connections are coordinated without a media server in the middle.</p>
          </article>
          <article className="border-[var(--border-default)] bg-[var(--color-primary-soft)] p-6 shadow-[var(--shadow-md)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">02 / Shared rooms</p>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">Give a room a name. Let people join.</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">Durable Objects keep each room synchronized while participants manage their own camera, microphone, and layout.</p>
          </article>
        </section>
      </div>
    </main>
  );
}