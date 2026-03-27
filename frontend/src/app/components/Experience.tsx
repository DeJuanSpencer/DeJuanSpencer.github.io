const experience = [
  {
    title: "Independent Software Engineer",
    company: "Freelance",
    duration: "Nov 2024 – Present",
    accent: "border-blue-500",
    bullets: [
      "Designed and shipped full-stack applications using .NET, Angular, Next.js, and Python — covering architecture, CI/CD, and deployment.",
      "Built a reusable Atomic Design component library that accelerated UI development across multiple projects.",
      "Delivered GenAI tooling and prompt engineering frameworks for chat interfaces, content generation, and automation workflows.",
      "Applied Agile practices across solo sprints: scoping, building, testing, and iterating on production-grade software.",
    ],
  },
  {
    title: "Software Development Consultant",
    company: "Insight Enterprises",
    duration: "May 2022 – Nov 2024",
    accent: "border-indigo-500",
    bullets: [
      "Built full-stack features using .NET, Angular, and Python for enterprise clients across public and private sectors.",
      "Developed modular UI component systems using Atomic Design, reducing dev time and improving cross-team consistency.",
      "Led Power Platform automation initiatives that eliminated manual workflows and improved process efficiency.",
      "Contributed to internal GenAI tooling and AI prompt frameworks, increasing team productivity with AI-assisted workflows.",
    ],
  },
  {
    title: "Intelligence Analyst",
    company: "Ohio Army National Guard",
    duration: "Feb 2017 – Feb 2025",
    accent: "border-green-600",
    bullets: [
      "Conducted strategic and tactical intelligence analysis using SIGINT, HUMINT, and geospatial tools under mission-critical conditions.",
      "Delivered time-sensitive intelligence briefings directly to senior leadership, translating complex data into actionable decisions.",
      "Coordinated data sharing and analysis across inter-agency teams, improving operational clarity and response speed.",
    ],
  },
];

export default function Experience() {
  return (
    <section className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Experience</h2>

      <div className="space-y-10">
        {experience.map((job, index) => (
          <div key={index} className={`bg-white shadow-md rounded-xl p-6 border-l-4 ${job.accent}`}>
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
