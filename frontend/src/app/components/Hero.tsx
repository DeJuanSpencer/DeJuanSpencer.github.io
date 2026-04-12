"use client";

import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const [imgError, setImgError] = useState(false);

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

      {/* Profile photo / initials fallback */}
      <div
        className="w-28 h-28 rounded-full overflow-hidden mb-6 relative flex items-center justify-center"
        style={{
          boxShadow: "0 0 0 3px var(--brand-gold), 0 4px 20px rgba(0,0,0,0.1)",
          background: imgError ? "var(--brand-gold)" : "transparent",
        }}
      >
        {imgError ? (
          <span className="text-2xl font-bold text-white select-none">DS</span>
        ) : (
          <Image
            src="/profile.jpg"
            alt="DeJuan Spencer"
            width={112}
            height={112}
            className="object-cover object-top w-full h-full"
            priority
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Availability badge */}
      <span
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1 rounded-full mb-6"
        style={{
          background: "rgba(184,151,47,0.08)",
          color: "var(--brand-gold)",
          border: "1px solid rgba(184,151,47,0.2)",
          letterSpacing: "0.5px",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        Available for New Projects
      </span>

      <h1
        className="text-4xl md:text-6xl font-bold mb-4"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
        }}
      >
        DeJuan Spencer
      </h1>

      <p
        className="text-sm font-medium mb-3"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.5px" }}
      >
        Software Engineer &nbsp;&middot;&nbsp; Army Veteran &nbsp;&middot;&nbsp; Top Secret Cleared
      </p>

      <p
        className="text-xl md:text-2xl font-semibold max-w-2xl mb-4"
        style={{ color: "var(--text-primary)", lineHeight: 1.4, letterSpacing: "-0.3px" }}
      >
        Production-grade software for organizations that can&apos;t afford to cut corners.
      </p>

      <p
        className="text-base max-w-xl mb-10"
        style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
      >
        Full-stack development, AI integrations, and cloud systems &mdash; delivered with the
        precision of an intelligence analyst and the accountability of a veteran.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <a
          href="/work-with-me"
          className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          style={{ background: "var(--brand-red)", fontSize: "15px" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.9")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        >
          Work With Me
        </a>
        <a
          href="#projects"
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
            fontSize: "15px",
          }}
        >
          View My Work
        </a>
      </div>

      {/* Social proof signal */}
      <p
        className="text-xs"
        style={{ color: "var(--text-tertiary)", fontStyle: "italic", letterSpacing: "0.2px" }}
      >
        Trusted by enterprise teams at Insight Enterprises and state government agencies
      </p>
    </section>
  );
}
