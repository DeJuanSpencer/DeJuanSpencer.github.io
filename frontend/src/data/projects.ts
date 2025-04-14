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
      description: "Developed a prompt framework for consistent AI output across internal tools.",
      stack: ["Python", "Azure OpenAI", "Prompt Engineering"],
    },
    {
      title: "ChatGPT Scheduling Plug-In",
      description: "Automates calendar scheduling using natural language with Google Calendar API.",
      stack: ["Python", "Google Calendar API"],
    },
    {
      title: "Skills Matrix App",
      description: "Visualized teammate strengths using Angular and C# for development teams.",
      stack: ["Angular", "C#", "Atomic Design"],
    },
    {
      title: "State of New Mexico Power Platform App",
      description: "Built centralized Power Query app to streamline workflows for state use cases.",
      stack: ["Power Platform", "Dataverse", "Power Query"],
    },
  ];
  
  export default projects;
  