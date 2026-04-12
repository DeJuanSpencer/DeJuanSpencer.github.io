/* eslint-disable react/no-unescaped-entities */
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 text-center">
      <h2
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        About Me
      </h2>

      <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        I'm a Software Engineer and U.S. Army Veteran with 5+ years of professional
        software delivery and a{" "}
        <span style={{ color: "var(--brand-gold)", fontWeight: 600 }}>Top Secret Security Clearance</span>.
        I bring a rare combination of engineering precision and strategic analysis &mdash; honed
        across enterprise consulting, military intelligence, and independent product development.
        My toolkit spans{" "}
        <span style={{ color: "var(--brand-gold)", fontWeight: 600 }}>
          Java, .NET, Python, React, Angular, Next.js, Azure, and Power Platform
        </span>.
      </p>

      <p className="text-lg leading-relaxed mt-5" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        Whether I'm architecting full-stack solutions, building AI-powered tools, or automating
        mission-critical workflows, I deliver with clarity and purpose. Clients get a partner
        who thinks in systems, communicates clearly, and ships quality software on time.
      </p>
    </section>
  );
}
