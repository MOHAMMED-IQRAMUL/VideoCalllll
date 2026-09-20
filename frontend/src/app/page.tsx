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
      </div>
    </main>
  );
}