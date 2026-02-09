"use client";

import { useMemo, useState, FormEvent } from "react";
import { AgentRun, ContentPillar } from "@/types/agent";

type RunStatus = "idle" | "running" | "error";

type FormState = {
  channelName: string;
  persona: string;
  niche: string;
  targetAudience: string;
  tone: "Casual" | "Professional" | "Energetic" | "Cinematic";
  language: string;
  contentPillars: string[];
  customPillars?: string;
  cadencePerWeek: number;
  videoLength: "Shorts" | "Mid-form" | "Long-form";
  callToAction: string;
  monetizationGoal: string;
  includeBroll: boolean;
  includeVoiceover: boolean;
};

type AgentRequestPayload = FormState;

const DEFAULT_FORM: FormState = {
  channelName: "ShadowSignals",
  persona: "Solo automation creator",
  niche: "AI-assisted personal finance",
  targetAudience: "Busy professionals seeking passive income ideas",
  tone: "Energetic",
  language: "English",
  contentPillars: ["Education", "Finance", "Motivation"],
  customPillars: "",
  cadencePerWeek: 3,
  videoLength: "Mid-form",
  callToAction: "Download the automation playbook",
  monetizationGoal: "Sell digital systems and earn affiliate revenue",
  includeBroll: true,
  includeVoiceover: true,
};

const CONTENT_PILLARS: ContentPillar[] = [
  "Education",
  "Entertainment",
  "Motivation",
  "Lifestyle",
  "Tech",
  "Finance",
  "Custom",
];

const TONES: FormState["tone"][] = [
  "Casual",
  "Professional",
  "Energetic",
  "Cinematic",
];

const VIDEO_LENGTHS: FormState["videoLength"][] = [
  "Shorts",
  "Mid-form",
  "Long-form",
];

export function AgentDashboard() {
  const [formData, setFormData] = useState<FormState>(DEFAULT_FORM);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AgentRun[]>([]);

  const latestRun = history[0] ?? null;

  const pillarBadges = useMemo(() => formData.contentPillars, [formData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("running");
    setError(null);

    const payload: AgentRequestPayload = {
      ...formData,
      customPillars: formData.customPillars?.trim()
        ? formData.customPillars.trim()
        : undefined,
    };

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body?.error ?? "Agent run failed. Check server logs for details.";
        throw new Error(message);
      }

      const { run } = (await response.json()) as { run: AgentRun };
      setHistory((prev) => [run, ...prev].slice(0, 5));
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function togglePillar(pillar: string) {
    setFormData((prev) => {
      if (prev.contentPillars.includes(pillar)) {
        return {
          ...prev,
          contentPillars: prev.contentPillars.filter((item) => item !== pillar),
        };
      }

      return {
        ...prev,
        contentPillars: [...prev.contentPillars, pillar],
      };
    });
  }

  function toggleCustomPillar() {
    setFormData((prev) => {
      const hasCustom = prev.contentPillars.includes("Custom");
      if (hasCustom) {
        return {
          ...prev,
          customPillars: "",
          contentPillars: prev.contentPillars.filter(
            (pillar) => pillar !== "Custom",
          ),
        };
      }

      return {
        ...prev,
        customPillars: prev.customPillars || "Audience Experiments",
        contentPillars: [...prev.contentPillars, "Custom"],
      };
    });
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function renderStatus() {
    if (status === "running") {
      return "Agent synthesizing automation workflow...";
    }
    if (status === "error" && error) {
      return error;
    }
    return "Configure your faceless channel automation and press Run Agent.";
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Channel Blueprint
            </h2>
            <p className="mt-2 text-sm text-slate-300">{renderStatus()}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              status === "running"
                ? "bg-amber-500/20 text-amber-200"
                : status === "error"
                ? "bg-rose-500/20 text-rose-200"
                : "bg-emerald-500/20 text-emerald-200"
            }`}
          >
            {status === "running"
              ? "Running"
              : status === "error"
              ? "Attention"
              : "Ready"}
          </span>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="Channel Name"
              value={formData.channelName}
              required
              onChange={(value) => updateField("channelName", value)}
            />
            <FormInput
              label="Operator Persona"
              value={formData.persona}
              required
              onChange={(value) => updateField("persona", value)}
            />
            <FormInput
              label="Channel Niche"
              value={formData.niche}
              required
              onChange={(value) => updateField("niche", value)}
            />
            <FormInput
              label="Target Audience"
              value={formData.targetAudience}
              required
              onChange={(value) => updateField("targetAudience", value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormSelect
              label="Narrative Tone"
              value={formData.tone}
              options={TONES.map((tone) => ({ label: tone, value: tone }))}
              onChange={(value) =>
                updateField(
                  "tone",
                  value as FormState["tone"],
                )
              }
            />
            <FormInput
              label="Primary Language"
              value={formData.language}
              required
              onChange={(value) => updateField("language", value)}
            />
            <FormSelect
              label="Video Length"
              value={formData.videoLength}
              options={VIDEO_LENGTHS.map((length) => ({
                label: length,
                value: length,
              }))}
              onChange={(value) =>
                updateField(
                  "videoLength",
                  value as FormState["videoLength"],
                )
              }
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              Content Pillars
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Select up to four pillars to focus your faceless content system.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CONTENT_PILLARS.map((pillar) => {
                const active =
                  pillar === "Custom"
                    ? Boolean(formData.customPillars)
                    : pillarBadges.includes(pillar);
                return (
                  <button
                    key={pillar}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                        : "border-white/10 text-slate-300 hover:border-indigo-500/60 hover:text-white"
                    }`}
                    onClick={() =>
                      pillar === "Custom" ? toggleCustomPillar() : togglePillar(pillar)
                    }
                  >
                    {pillar === "Custom" && formData.customPillars
                      ? `Custom (${formData.customPillars})`
                      : pillar}
                  </button>
                );
              })}
            </div>
            {formData.customPillars !== undefined && (
              <FormInput
                className="mt-4"
                label="Custom Pillar"
                value={formData.customPillars ?? ""}
                placeholder="E.g. Automation breakdowns"
                onChange={(value) => updateField("customPillars", value)}
              />
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="Primary Call To Action"
              value={formData.callToAction}
              required
              onChange={(value) => updateField("callToAction", value)}
            />
            <FormInput
              label="Monetization Goal"
              value={formData.monetizationGoal}
              required
              onChange={(value) => updateField("monetizationGoal", value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Weekly Cadence
              </label>
              <div className="mt-3 flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={formData.cadencePerWeek}
                  onChange={(event) =>
                    updateField("cadencePerWeek", Number(event.target.value))
                  }
                  className="w-full accent-indigo-500"
                />
                <span className="text-sm font-semibold text-indigo-200">
                  {formData.cadencePerWeek}x / week
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Render Automation
                </p>
                <p className="text-xs text-slate-400">
                  Toggle asset creation modules.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  label="AI B-roll"
                  active={formData.includeBroll}
                  onChange={() =>
                    updateField("includeBroll", !formData.includeBroll)
                  }
                />
                <Toggle
                  label="Voiceover"
                  active={formData.includeVoiceover}
                  onChange={() =>
                    updateField("includeVoiceover", !formData.includeVoiceover)
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "running"}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01] hover:shadow-[0_20px_45px_-20px_rgba(79,70,229,0.8)] disabled:cursor-wait disabled:opacity-70"
          >
            <span>Run Agent</span>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] uppercase tracking-wide text-indigo-50"
            >
              {status === "running" ? "Synthesizing" : "Automation"}
            </span>
          </button>
        </form>
      </section>

      <section className="flex h-full flex-col gap-6">
        {latestRun ? (
          <>
            <AgentRunSummary run={latestRun} />
            <AgentRunDetails run={latestRun} />
            {history.length > 1 && (
              <RunHistory runs={history.slice(1)} />
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function AgentRunSummary({ run }: { run: AgentRun }) {
  const runDate = useMemo(
    () =>
      new Date(run.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [run.createdAt],
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,1)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Automation Run</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-indigo-200">
            {run.input.channelName} • {run.input.niche}
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">{runDate}</span>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm text-slate-200">
        {run.overallSummary}
      </p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Badge label={`${run.input.cadencePerWeek}x cadence`} />
        <Badge label={`${run.input.videoLength} format`} />
        <Badge label={`${run.input.tone} tone`} />
        <Badge label={run.input.targetAudience} />
      </div>
      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Next Moves
        </h4>
        <ul className="mt-2 space-y-2 text-xs text-slate-300">
          {run.followUpTasks.slice(0, 3).map((task) => (
            <li
              key={task}
              className="rounded-xl border border-white/5 bg-white/5 px-3 py-2"
            >
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AgentRunDetails({ run }: { run: AgentRun }) {
  return (
    <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-inner">
      <div className="max-h-[480px] space-y-6 overflow-y-auto p-6">
        {run.results.map((result) => (
          <article
            key={result.id}
            className="rounded-2xl border border-white/5 bg-white/[0.04] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {result.title}
                </h4>
                <p className="mt-1 text-xs text-indigo-200">{result.summary}</p>
              </div>
              <Badge label={result.id} />
            </div>
            <div className="mt-4 space-y-4 text-xs text-slate-200">
              {result.artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="rounded-xl border border-white/5 bg-slate-900/60 p-3"
                >
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {artifact.label}
                  </h5>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-slate-200">
                    {artifact.content}
                  </pre>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recommendations
              </h5>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {result.recommendations.map((rec) => (
                  <li key={rec} className="flex gap-2">
                    <span className="text-indigo-400">▹</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RunHistory({ runs }: { runs: AgentRun[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
      <h3 className="text-sm font-semibold text-white">Recent Runs</h3>
      <ul className="mt-4 space-y-3 text-xs text-slate-300">
        {runs.map((run) => (
          <li
            key={run.id}
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-200">
                {run.input.channelName}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-indigo-200">
                {run.input.niche}
              </p>
            </div>
            <div className="text-right">
              <p>{new Date(run.createdAt).toLocaleTimeString()}</p>
              <p className="text-[11px] text-slate-400">
                {run.results.length} modules
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-12 text-center text-slate-300">
      <div className="rounded-full border border-white/10 bg-indigo-500/20 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-indigo-50">
        Automation Ready
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">
        Orchestrate your faceless channel
      </h3>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        Feed the agent your channel parameters. It will return a full stack of
        scripts, b-roll cues, AI voice direction, SEO, and a weekly operating
        playbook.
      </p>
      <div className="mt-8 text-xs text-slate-500">
        Tip: pair with Zapier or Airtable to auto-trigger production.
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  className,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`block text-sm text-slate-300 ${className ?? ""}`}>
      <span className="font-semibold text-white">{label}</span>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide ${
        active
          ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
          : "border-white/10 text-slate-400 hover:border-white/30"
      }`}
    >
      <span className="text-xs">{label}</span>
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-slate-600"
        }`}
      />
    </button>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
      {label}
    </span>
  );
}
