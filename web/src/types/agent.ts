export type ContentPillar =
  | "Education"
  | "Entertainment"
  | "Motivation"
  | "Lifestyle"
  | "Tech"
  | "Finance"
  | "Custom";

export type AgentInput = {
  channelName: string;
  persona: string;
  niche: string;
  targetAudience: string;
  tone: "Casual" | "Professional" | "Energetic" | "Cinematic";
  language: string;
  contentPillars: ContentPillar[];
  customPillars?: string;
  cadencePerWeek: number;
  videoLength: "Shorts" | "Mid-form" | "Long-form";
  callToAction: string;
  monetizationGoal: string;
  includeBroll: boolean;
  includeVoiceover: boolean;
};

export type AgentStepId =
  | "ideation"
  | "script"
  | "broll"
  | "voiceover"
  | "seo"
  | "schedule";

export type AgentStep = {
  id: AgentStepId;
  label: string;
  description: string;
};

export type AgentStepResult = {
  id: AgentStepId;
  title: string;
  summary: string;
  artifacts: Array<{
    id: string;
    label: string;
    content: string;
    type: "text" | "markdown" | "list";
  }>;
  recommendations: string[];
};

export type AgentRun = {
  id: string;
  createdAt: string;
  input: AgentInput;
  results: AgentStepResult[];
  overallSummary: string;
  followUpTasks: string[];
};
