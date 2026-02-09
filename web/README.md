## Agentic Faceless Channel Studio

Automation studio for building and running faceless YouTube channels. Feed the agent your channel thesis—it generates video ideas, narration scripts, AI B-roll prompts, voiceover direction, metadata, and a weekly operating schedule.

### Key Modules

- **Strategy Intake** – form-driven orchestration for niche, audience, tone, cadence, and monetisation goals.
- **Content Ideation** – multi-pillar ideation returning hooks, structures, and CTA alignment.
- **Narration & Voiceover** – long-form script plus optional AI voice direction with timecodes.
- **Production Assets** – automated B-roll shot lists and tooling suggestions.
- **SEO Toolkit** – title, description, keywords, hashtags, and publishing checklist.
- **Operating System** – cadence-aligned weekly workflow with automation levers and KPIs.

### Requirements

- Node.js 18+
- Optional: `OPENAI_API_KEY` for live LLM generations (falls back to heuristic templates if unset)

Copy `.env.example` to `.env.local` and fill in your OpenAI key:

```bash
cp .env.example .env.local
```

### Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to launch the studio.

### Production Build

```bash
npm run build
npm start
```

### Architecture

- **Next.js App Router** with TypeScript and Tailwind CSS
- **API Route** `app/api/agent/route.ts` orchestrates the automation pipeline
- **Domain Logic** `src/lib/agent.ts` handles LLM calls with JSON parsing + deterministic fallbacks
- **UI** `src/components/AgentDashboard.tsx` implements the dashboard and output viewers

### Deployment

Deploy to Vercel with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-3a64e0f0
```

The production URL is https://agentic-3a64e0f0.vercel.app
