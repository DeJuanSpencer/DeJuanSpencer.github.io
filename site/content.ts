// All rendered copy and outbound URLs for dejuanspencer.com.
// Components render from these constants; no copy is hardcoded in JSX.

export const SITE_URL = "https://dejuanspencer.com";

// TODO: pending an env and git-history audit. While null, the Repo row
// renders without a link.
export const MOTION_MCP_REPO_URL: string | null = null;
export const YNAB_MCP_REPO_URL: string | null = null;

export const GITHUB_URL: string | null = "https://github.com/DeJuanSpencer";
export const LINKEDIN_URL: string | null = "https://linkedin.com/in/dejuanspencer";
export const STANZIX_URL = "https://stanzix.com";
export const EMAIL = "dejuanspencer@gmail.com";

export const META = {
  title: "DeJuan Spencer - Software Engineer",
  description: "Software engineer building AI systems that ship.",
} as const;

export const MASTHEAD = {
  name: "DeJuan Spencer",
  subline: "Software engineer building AI systems that ship.",
} as const;

export const LABELS = {
  work: "WORK",
  exploring: "EXPLORING",
  about: "ABOUT",
  live: "LIVE",
} as const;

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  live: boolean;
  lead: boolean;
  hairline: boolean;
  tags: string;
  body: string;
  link: ProjectLink | null;
}

export const PROJECTS: Project[] = [
  {
    title: "Stanzix",
    live: true,
    lead: true,
    hairline: false,
    tags: "NEXT.JS · SUPABASE · STRIPE · ANTHROPIC",
    body: "Structured prompt engineering for teams. A guided pipeline that turns rough intent into production-grade system prompts. Versioned, testable, exportable.",
    link: { label: "stanzix.com →", href: STANZIX_URL },
  },
  {
    title: "motion-mcp",
    live: false,
    lead: false,
    hairline: true,
    tags: "MCP SERVER · SELF-HOSTED",
    body: "MCP server that gives Claude direct control of Motion: calendar, tasks, and scheduling from the conversation.",
    link: MOTION_MCP_REPO_URL ? { label: "Repo →", href: MOTION_MCP_REPO_URL } : null,
  },
  {
    title: "ynab-mcp",
    live: false,
    lead: false,
    hairline: true,
    tags: "MCP SERVER · SELF-HOSTED",
    body: "MCP server for driving YNAB from Claude: budgets, transactions, and category moves without opening the app.",
    link: YNAB_MCP_REPO_URL ? { label: "Repo →", href: YNAB_MCP_REPO_URL } : null,
  },
];

export const EXPLORING_BODY =
  "Agentic systems: multi-agent pipelines, tool-use orchestration, and what breaks when models act instead of answer.";

export const ABOUT_BODY =
  "Software Engineer at Insight Enterprises. Learns by building. Everything above started as a question. Teaches Indonesian Kung Fu, and has since fifteen.";

export const FOOTER_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
} as const;

export const PERSON = {
  jobTitle: "Software Engineer",
  worksFor: "Insight Enterprises",
} as const;
