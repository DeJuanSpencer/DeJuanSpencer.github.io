"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-8 mt-0"
      style={{
        background: "var(--brand-foundation)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>DeJuan Spencer</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              &copy; {new Date().getFullYear()} &middot; Open to Remote &amp; On-site Engagements
            </p>
          </div>

          <div className="flex space-x-6 text-xl">
            <Link
              href="https://linkedin.com/in/dejuanspencer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand-gold)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              <i className="fab fa-linkedin"></i>
            </Link>
            <Link
              href="https://github.com/DeJuanSpencer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand-gold)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              <i className="fab fa-github"></i>
            </Link>
            <Link
              href="mailto:dejuanspencer@gmail.com"
              aria-label="Email"
              style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand-gold)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              <i className="fas fa-envelope"></i>
            </Link>
          </div>
        </div>

        <p
          className="text-xs italic text-center"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.3px" }}
        >
          Built in Cleveland. Refined in Irvine.
        </p>
      </div>
    </footer>
  );
}
