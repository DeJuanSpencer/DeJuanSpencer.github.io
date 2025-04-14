"use client";

import Link from "next/link";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

type Props = {
  className?: string;
  onClick?: () => void; // for mobile close menu on click
};

export default function Links({ className = "", onClick }: Props) {
  return (
    <nav
      className={`space-x-6 md:space-x-6 text-gray-700 font-medium ${className}`}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-blue-600 transition block md:inline"
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
