"use client";
import projects from "@/data/projects";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-3"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Selected Work
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
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {project.description}
            </p>

            {/* Outcome callout */}
            {project.outcome && (
              <div
                className="rounded-lg px-4 py-3 mb-4 text-sm"
                style={{
                  background: "rgba(184,151,47,0.06)",
                  border: "1px solid rgba(184,151,47,0.15)",
                  color: "var(--brand-gold)",
                  lineHeight: 1.6,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "2px", opacity: 0.7 }}>Result</span>
                {project.outcome}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-auto">
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
          </div>
        ))}
      </div>
    </div>
  );
}
