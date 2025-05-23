const experience = [
  {
    title: "Independent Software Engineer",
    company: "Freelance",
    duration: "Nov 2024 – Present",
    bullets: [
      "Built and deployed self-initiated full-stack projects using .NET, Angular, and Python to explore scalable architecture patterns and business use cases.",
      "Created a library of reusable UI components based on Atomic Design, enhancing consistency and speed across personal app interfaces.",
      "Developed automation tools with Power Platform to streamline repetitive tasks and integrate personal workflows with external APIs.",
      "Prototyped GenAI tools and prompt engineering frameworks, experimenting with use cases for chat interfaces, content generation, and research assistants.",
      "Led all phases of the software lifecycle independently, from architecture and coding to testing, deployment, and iteration, applying Agile principles to personal project sprints.",
      "Explored advanced system design techniques including event-driven microservices, layered architecture, and domain-driven design across experimental builds.",
      "Maintained high-quality documentation, GitHub repositories, and demos to showcase technical decisions and design rationale.",
    ],
  },

  {
    title: "Software Development Consultant",
    company: "Insight Enterprises",
    duration: "May 2022 – Nov 2024",
    bullets: [
      "Built full-stack features using .NET, Angular, and Python for enterprise clients.",
      "Developed reusable UI components and modular architecture using Atomic Design.",
      "Led Power Platform automation efforts for workflow optimization.",
      "Contributed to GenAI internal tools and AI prompt frameworks.",
    ],
  },
  {
    title: "Intelligence Analyst",
    company: "Ohio Army National Guard",
    duration: "Feb 2017 – Feb 2025",
    bullets: [
      "Conducted strategic/tactical intelligence analysis using SIGINT, HUMINT, and mapping tools.",
      "Delivered time-sensitive briefings to leadership in mission-critical settings.",
      "Streamlined data collaboration across inter-agency teams.",
    ],
  },
];

export default function Experience() {
  return (
    <section className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Experience</h2>

      <div className="space-y-10">
        {experience.map((job, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">
              {job.company} • <span className="italic">{job.duration}</span>
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-700">
              {job.bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
