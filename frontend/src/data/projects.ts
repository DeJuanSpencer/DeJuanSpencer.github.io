export type Project = {
    title: string;
    description: string;
    outcome: string;
    stack: string[];
    link?: string;
    image?: string;
  };

  const projects: Project[] = [
    {
      title: "GenAI Internal Tooling",
      description:
        "Designed and implemented a prompt engineering framework that standardized AI output quality across multiple internal tools, enabling a team of engineers to build consistently on top of Azure OpenAI.",
      outcome: "Cut prompt iteration time by ~60% and reduced output inconsistencies across 5+ internal tools.",
      stack: ["Python", "Azure OpenAI", "Prompt Engineering"],
    },
    {
      title: "ChatGPT Scheduling Plug-In",
      description:
        "Built a natural language scheduling assistant that parses user intent and creates calendar events via the Google Calendar API, replacing a manual back-and-forth coordination process.",
      outcome: "Eliminated 8+ hours per week of manual scheduling overhead for recurring coordination tasks.",
      stack: ["Python", "Google Calendar API", "OpenAI"],
    },
    {
      title: "Skills Matrix App",
      description:
        "Developed a full-stack application for development teams to map and visualize individual skill sets, giving managers real-time visibility into capability gaps across their organization.",
      outcome: "Enabled managers to identify skill gaps and make informed team composition decisions across a 20+ person development org.",
      stack: ["Angular", "C#", ".NET"],
    },
    {
      title: "State of New Mexico — Power Platform",
      description:
        "Delivered a centralized Power Platform solution for a state government agency, consolidating five disconnected tools into a single auditable application with automated reporting.",
      outcome: "Replaced 5 disconnected tools with one auditable system, reducing manual data reconciliation for the agency's operations team.",
      stack: ["Power Platform", "Dataverse", "Power Query", "SharePoint"],
    },
  ];

  export default projects;
