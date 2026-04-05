const experience = [
  {
    title: "Software Development Consultant",
    company: "Insight Enterprises",
    duration: "May 2022 - Present",
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
    duration: "Feb 2017 - Feb 2025",
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
      <h2
        className="text-3xl font-bold text-center mb-10"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Experience
      </h2>

      <div className="space-y-6">
        {experience.map((job, index) => (
          <div
            key={index}
            className="rounded-xl p-6"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {job.title}
            </h3>
            <p className="mt-1" style={{ color: "var(--text-tertiary)", fontSize: "14px" }}>
              {job.company} &bull;{" "}
              <span style={{ fontStyle: "italic" }}>{job.duration}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {job.bullets.map((item, i) => (
                <li
                  key={i}
                  className="text-sm flex gap-3"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  <span style={{ color: "var(--brand-gold)", flexShrink: 0, marginTop: "2px" }}>
                    &bull;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
