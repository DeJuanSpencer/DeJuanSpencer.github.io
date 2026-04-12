const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We talk through what you need to build, the constraints, and whether I'm the right fit. No commitment, no pitch — just a straight conversation about the problem.",
  },
  {
    number: "02",
    title: "Proposal",
    description:
      "I scope the work, define deliverables, and send a clear written proposal with timeline and price. Fixed-scope or retainer — your choice. No ambiguity about what you're paying for.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "I ship in milestones with regular updates. You see working software at each stage, not a black box that opens six weeks later. Questions get answered within 24 hours.",
  },
  {
    number: "04",
    title: "Handoff",
    description:
      "Clean, documented code that your team can own and maintain. I walk you through what was built, how it works, and what to do next. I stay available for questions after launch.",
  },
];

export default function WorkProcess() {
  return (
    <section className="max-w-5xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-3"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        How I Work
      </h2>
      <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
        No surprises, no going dark. Here&apos;s what working together actually looks like.
      </p>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className="hidden md:block absolute top-6 left-[calc(100%_-_12px)] w-6 h-px"
                style={{ background: "var(--border-medium)", zIndex: 0 }}
              />
            )}
            <div
              className="rounded-xl p-5 h-full"
              style={{
                background: "var(--brand-surface)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                className="text-2xl font-bold mb-3"
                style={{ color: "var(--brand-gold)", fontFamily: "var(--font-mono)" }}
              >
                {step.number}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
