"use client";

import { useState } from "react";
import Link from "next/link";
import Links from "./Links";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Name */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          DeJuan Spencer
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <Links />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 px-6 pb-4">
          <Links
            className="flex flex-col space-y-2"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
