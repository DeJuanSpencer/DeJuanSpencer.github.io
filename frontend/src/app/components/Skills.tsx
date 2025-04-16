const skills = {
  Languages: ["C#", "Python", "Java", "TypeScript", "JavaScript"],
  Frameworks: [
    ".NET",
    "Angular",
    "React",
    "Next",
    "Node.js",
    "Spring",
    "Hibernate",
  ],
  Cloud: ["Azure", "AWS", "GCP"],
  Databases: ["SQL Server", "PostgreSQL", "Dataverse"],
  Tools: ["Git", "CI/CD", "Power Platform", "SharePoint", "Power Query"],
  Practices: ["Agile (Scrum)", "TDD", "MVC", "OOP", "DDD", "Atomic Design"],
};

export default function Skills() {
  return (
    <section className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Skills & Tools</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {Object.entries(skills).map(([category, items], index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
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
