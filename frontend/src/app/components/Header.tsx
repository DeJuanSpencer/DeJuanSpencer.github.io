"use client";

import { useState } from "react";
import Link from "next/link";
import Links from "./Links";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="w-full px-6 py-4 sticky top-0 z-50"
      style={{
        background: "rgba(250,250,247,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          DeJuan Spencer
        </Link>

        <div className="hidden md:flex">
          <Links className="desktop-nav" />
        </div>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          style={{ color: "var(--text-secondary)" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden mt-2 px-6 pb-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <Links
            className="mobile-nav"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
