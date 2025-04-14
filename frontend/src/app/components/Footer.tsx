import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Name & Copyright */}
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} DeJuan Spencer. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex space-x-6 text-gray-600 text-xl">
          <Link
            href="https://linkedin.com/in/dejuanspencer"
            target="_blank"
            className="hover:text-blue-600"
          >
            <i className="fab fa-linkedin"></i>
          </Link>
          <Link
            href="https://github.com/yourusername"
            target="_blank"
            className="hover:text-black"
          >
            <i className="fab fa-github"></i>
          </Link>
          <Link
            href="mailto:dejuanspencer@gmail.com"
            className="hover:text-red-500"
          >
            <i className="fas fa-envelope"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
