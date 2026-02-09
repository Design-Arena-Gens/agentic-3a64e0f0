import { AgentDashboard } from "@/components/AgentDashboard";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25)_0,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 md:px-10 lg:px-14">
        <header className="max-w-3xl space-y-6">
          <p className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-100">
            Agentic Studio
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Faceless YouTube automation orchestrator
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Feed the agent your channel thesis. It composes scripts, voiceover
            briefs, AI b-roll, SEO metadata, and a weekly operating system so
            you can publish on autopilot.
          </p>
        </header>

        <AgentDashboard />
      </main>
    </div>
  );
}
