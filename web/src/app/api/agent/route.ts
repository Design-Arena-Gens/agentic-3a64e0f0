import { NextResponse } from "next/server";
import { z } from "zod";
import { runAutomationPipeline } from "@/lib/agent";
import { AgentInput } from "@/types/agent";

const agentInputSchema = z.object({
  channelName: z.string().min(2),
  persona: z.string().min(2),
  niche: z.string().min(2),
  targetAudience: z.string().min(2),
  tone: z.enum(["Casual", "Professional", "Energetic", "Cinematic"]),
  language: z.string().min(2),
  contentPillars: z.array(z.string()).min(1),
  customPillars: z.string().optional(),
  cadencePerWeek: z.number().int().min(1).max(14),
  videoLength: z.enum(["Shorts", "Mid-form", "Long-form"]),
  callToAction: z.string().min(5),
  monetizationGoal: z.string().min(2),
  includeBroll: z.boolean(),
  includeVoiceover: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = agentInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const input: AgentInput = {
      ...payload,
      contentPillars: payload.contentPillars.map((pillar) =>
        pillar === "Custom" && payload.customPillars
          ? payload.customPillars
          : pillar,
      ) as AgentInput["contentPillars"],
    };

    const run = await runAutomationPipeline(input);

    return NextResponse.json({
      run,
      info: {
        engine: process.env.OPENAI_API_KEY ? "openai" : "heuristic",
      },
    });
  } catch (error) {
    console.error("Agent route failure:", error);
    return NextResponse.json(
      {
        error: "Agent failed to generate automation plan.",
      },
      { status: 500 },
    );
  }
}
