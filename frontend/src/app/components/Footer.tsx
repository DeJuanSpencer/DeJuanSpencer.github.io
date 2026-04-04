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
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          &copy; {new Date().getFullYear()} DeJuan Spencer. All rights reserved.
        </p>

        <div className="flex space-x-6 text-xl">
          <Link
            href="https://linkedin.com/in/dejuanspencer"
            target="_blank"
            style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand-gold)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-tertiary)")}
          >
            <i className="fab fa-linkedin"></i>
          </Link>
          <Link
            href="mailto:dejuanspencer@gmail.com"
            style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--brand-gold)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-tertiary)")}
          >
            <i className="fas fa-envelope"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
