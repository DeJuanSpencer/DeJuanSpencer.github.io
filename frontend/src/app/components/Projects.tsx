"use client";
import projects from "@/data/projects";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-3"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Projects
      </h2>
      <p className="text-center mb-10 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
        A selection of work spanning enterprise consulting, government, and independent builds.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-xl p-6 transition-all duration-300 flex flex-col"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,151,47,0.3)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {project.title}
            </h3>
            <p className="mb-4 text-sm flex-1" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: "var(--brand-violet-muted)",
                    color: "var(--brand-violet-text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium hover:underline mt-auto"
                style={{ color: "var(--brand-gold)", fontSize: "13px" }}
              >
                View on GitHub
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
