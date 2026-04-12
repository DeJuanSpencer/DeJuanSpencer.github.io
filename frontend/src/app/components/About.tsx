/* eslint-disable react/no-unescaped-entities */
export default function About() {
  const credentials = [
    { label: "Top Secret / SCI", sub: "Active federal security clearance" },
    { label: "5+ Years", sub: "Professional software delivery" },
    { label: "Insight Enterprises", sub: "Fortune 500 IT consulting" },
    { label: "U.S. Army Veteran", sub: "Military intelligence background" },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 text-center">
      <h2
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        About Me
      </h2>

      <p className="text-lg leading-relaxed mb-5" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        I'm a Software Engineer and U.S. Army Veteran with 5+ years of professional software
        delivery and an active{" "}
        <span style={{ color: "var(--brand-gold)", fontWeight: 600 }}>Top Secret / SCI Security Clearance</span>.
        At Insight Enterprises — a Fortune 500 IT firm serving 6,000+ clients — I delivered
        full-stack solutions across healthcare, government, and financial services, working
        directly with enterprise teams on high-stakes systems.
      </p>

      <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        My background in military intelligence means I think about systems differently: where are
        the failure points, what happens under pressure, how do you build something that holds up
        when it matters most. That lens carries into every line of code I write.
      </p>

      {/* Credential pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {credentials.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-4"
            style={{
              background: "var(--brand-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="text-sm font-bold mb-1" style={{ color: "var(--brand-gold)" }}>
              {c.label}
            </div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
