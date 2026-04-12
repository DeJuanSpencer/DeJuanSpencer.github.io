export default function MartialArts() {
  return (
    <section className="max-w-4xl mx-auto px-6 text-center">
      <h2
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
      >
        Beyond the Code
      </h2>

      <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
        As a Sifu of Kuntao-Silat, I have trained and taught martial arts for
        years, cultivating discipline, patience, and precision. My approach to
        software mirrors my practice: methodical, adaptive, and rooted in
        mastery of fundamentals. I build software the same way I train &mdash;
        with a long view.
      </p>

      <div
        className="max-w-xl mx-auto rounded-xl p-8"
        style={{
          background: "var(--brand-surface)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-1px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, var(--brand-gold), transparent)",
            borderRadius: "2px",
          }}
        />
        <p
          className="text-lg italic"
          style={{ color: "var(--text-primary)", lineHeight: 1.6 }}
        >
          &ldquo;Discipline bridges the gap between vision and execution.&rdquo;
        </p>
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
        >
          &mdash; Jim Rohn
        </p>
      </div>
    </section>
  );
}
