"use client";

import Link from "next/link";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Contact", href: "/#contact" },
  { name: "Work With Me", href: "/work-with-me", highlight: true },
  { name: "Prompt Engine", href: "/prompt-engine", accent: true },
];

type Props = {
  className?: string;
  onClick?: () => void;
};

export default function Links({ className = "", onClick }: Props) {
  return (
    <nav className={className}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors duration-200"
          style={{
            color: link.highlight
              ? "var(--brand-red)"
              : link.accent
              ? "var(--brand-gold)"
              : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: link.highlight || link.accent ? 600 : 500,
          }}
          onMouseEnter={(e) => {
            if (!link.highlight) {
              (e.target as HTMLElement).style.color = "var(--brand-gold)";
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = link.highlight
              ? "var(--brand-red)"
              : link.accent
              ? "var(--brand-gold)"
              : "var(--text-secondary)";
          }}
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
