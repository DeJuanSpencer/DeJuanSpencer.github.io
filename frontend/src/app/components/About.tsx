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
        I'm a Software Engineer and Intelligence Analyst with a Top
        Secret Security Clearance. I bring a unique blend of problem-solving,
        discipline, and innovation from both the tech industry and military
        intelligence space. My toolkit includes technologies like{" "}
        <span style={{ color: "var(--brand-gold)", fontWeight: 600 }}>
          Java, .NET, Python, Next, Azure, and Power Platform
        </span>
        , and I'm passionate about building scalable, mission-critical software
        for public and private sector clients.
      </p>

      <p className="text-lg leading-relaxed mt-5" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        Outside of coding, I'm a martial arts instructor and systems thinker who
        applies AI tools to real-world problems. Whether I'm
        architecting full-stack solutions, or automating
        workflows, I deliver high-performance outcomes with clarity and purpose.
      </p>
    </section>
  );
}
