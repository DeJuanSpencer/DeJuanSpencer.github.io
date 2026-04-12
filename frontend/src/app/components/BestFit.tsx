const fits = [
  {
    title: "Government & Defense-Adjacent Work",
    description:
      "Projects requiring an active security clearance, compliance-aware architecture, or experience working within federal/state procurement constraints.",
  },
  {
    title: "AI & Automation Integration",
    description:
      "Teams that want to wire AI into their existing workflows — not a chatbot demo, but a production integration that does real work.",
  },
  {
    title: "Replacing Manual Processes",
    description:
      "Businesses running critical operations on spreadsheets, email chains, or disconnected tools that need to be consolidated into a single, reliable system.",
  },
  {
    title: "Senior Execution Without a Full Team",
    description:
      "Founders and CTOs who need someone who can own the full stack — architecture through deployment — without building out a four-person team to do it.",
  },
];

const notFits = [
  "Projects under $5,000",
  "Pure design or brand work (no engineering component)",
  "Projects that need to start in under one week",
];

export default function BestFit() {
  return (
    <section className="max-w-5xl mx-auto px-6">
      <h2
        className="text-3xl font-bold text-center mb-3"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Who I Work With
      </h2>
      <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
        I work best on a specific type of problem. Here&apos;s how to know if we&apos;re a good fit.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {fits.map((fit) => (
          <div
            key={fit.title}
            className="rounded-xl p-5 flex gap-4"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "rgba(184,151,47,0.15)", border: "1px solid rgba(184,151,47,0.3)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
                {fit.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {fit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-5 max-w-xl mx-auto"
        style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-subtle)" }}
      >
        <p className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-tertiary)", letterSpacing: "1px" }}>
          Probably not the right fit if
        </p>
        <ul className="space-y-1">
          {notFits.map((item) => (
            <li key={item} className="text-sm flex gap-2" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--text-tertiary)" }}>&mdash;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
