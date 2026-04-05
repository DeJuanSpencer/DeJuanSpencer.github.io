"use client";

export default function Hero() {
  return (
    <section
      className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
      style={{ background: "var(--brand-foundation)" }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,151,47,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <p
        className="text-sm font-semibold tracking-widest uppercase mb-6"
        style={{
          color: "var(--brand-gold)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "3px",
          fontSize: "12px",
        }}
      >
        &ldquo;Be the designer of your world and not merely the consumer of it.&rdquo;
        <br />
        <span style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "1.5px", opacity: 0.7 }}>&mdash; James Clear</span>
      </p>

      <h1
        className="text-4xl md:text-6xl font-bold mb-5"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
        }}
      >
        DeJuan Spencer
      </h1>

      <p
        className="text-lg md:text-xl max-w-2xl mb-10"
        style={{
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        Software Engineer &bull; Systems Thinker &bull; Veteran &bull; Martial Arts Instructor
        <br />
        Building scalable, intelligent systems at the intersection of tech and strategy.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="/work-with-me"
          className="px-7 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          style={{ background: "var(--brand-red)", fontSize: "15px" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--brand-red-hover)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--brand-red)")}
        >
          Work With Me
        </a>
        <a
          href="#projects"
          className="px-7 py-3 rounded-lg font-semibold transition-all duration-200"
          style={{
            background: "var(--brand-gold)",
            color: "#fff",
            fontSize: "15px",
          }}
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="px-7 py-3 rounded-lg font-semibold transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
            fontSize: "15px",
          }}
        >
          Contact Me
        </a>

      </div>
    </section>
  );
}
