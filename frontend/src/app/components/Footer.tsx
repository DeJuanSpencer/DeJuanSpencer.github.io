import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Name, Copyright & Location */}
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-gray-700">DeJuan Spencer</p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} · Open to Remote &amp; On-site Engagements
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6 text-gray-500 text-xl">
          <Link
            href="https://linkedin.com/in/dejuanspencer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </Link>
          <Link
            href="https://github.com/DeJuanSpencer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </Link>
          <Link
            href="mailto:dejuanspencer@gmail.com"
            className="hover:text-red-500 transition"
            aria-label="Email"
          >
            <i className="fas fa-envelope"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
