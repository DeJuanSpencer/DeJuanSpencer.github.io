const skills = {
  Languages: ["C#", "Python", "Java", "TypeScript", "JavaScript"],
  Frameworks: [".NET", "Angular", "React", "Next", "Node.js", "Spring", "Hibernate"],
  Cloud: ["Azure", "AWS", "GCP"],
  Databases: ["SQL Server", "PostgreSQL", "Dataverse"],
  Tools: ["Git", "CI/CD", "Power Platform", "SharePoint", "Power Query"],
  Practices: ["Agile (Scrum)", "TDD", "MVC", "OOP", "DDD", "Atomic Design"],
};

export default function Skills() {
  return (
    <section className="max-w-4xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-10"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Skills & Tools
      </h2>

      <div className="grid sm:grid-cols-2 gap-8">
        {Object.entries(skills).map(([category, items], index) => (
          <div key={index}>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--brand-gold)", fontSize: "14px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1.5px" }}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    background: "var(--brand-violet-muted)",
                    color: "var(--brand-violet-text)",
                    fontSize: "13px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
