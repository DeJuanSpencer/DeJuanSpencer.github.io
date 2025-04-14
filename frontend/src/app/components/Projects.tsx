import projects from "@/data/projects";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Projects</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
