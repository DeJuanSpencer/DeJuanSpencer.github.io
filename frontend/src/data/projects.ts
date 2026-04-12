export type Project = {
    title: string;
    description: string;
    stack: string[];
    link?: string;
    image?: string;
  };
  
  const projects: Project[] = [
    {
      title: "GenAI Internal Tooling",
      description:
        "Designed and implemented a prompt engineering framework that standardized AI output quality across multiple internal tools. Reduced prompt iteration time and improved consistency for a team of engineers building on top of Azure OpenAI.",
      stack: ["Python", "Azure OpenAI", "Prompt Engineering"],
      link: "https://github.com/DeJuanSpencer",
    },
    {
      title: "ChatGPT Scheduling Plug-In",
      description:
        "Built a natural language scheduling assistant that parses user intent and creates calendar events via the Google Calendar API. Eliminated manual scheduling overhead for recurring coordination tasks.",
      stack: ["Python", "Google Calendar API", "OpenAI"],
      link: "https://github.com/DeJuanSpencer",
    },
    {
      title: "Skills Matrix App",
      description:
        "Developed a full-stack application for development teams to map and visualize individual skill sets, enabling managers to identify gaps and optimize team composition. Built with Atomic Design principles for a scalable, reusable component library.",
      stack: ["Angular", "C#", ".NET", "Atomic Design"],
      link: "https://github.com/DeJuanSpencer",
    },
    {
      title: "State of New Mexico Power Platform App",
      description:
        "Delivered a centralized Power Platform solution for a state government client, consolidating disparate workflows into a single, auditable app. Integrated Dataverse for structured data management and Power Query for automated reporting.",
      stack: ["Power Platform", "Dataverse", "Power Query", "SharePoint"],
    },
  ];
  
  export default projects;
  