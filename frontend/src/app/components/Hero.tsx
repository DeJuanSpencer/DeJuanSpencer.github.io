import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Profile Photo */}
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 shadow-lg ring-4 ring-blue-100">
        <Image
          src="/profile.jpg"
          alt="DeJuan Spencer"
          width={128}
          height={128}
          className="object-cover object-top w-full h-full"
          priority
        />
      </div>

      {/* Availability badge */}
      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-sm font-medium px-4 py-1 rounded-full mb-5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Available for Projects
      </span>

      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        DeJuan Spencer
      </h1>

      <p className="text-lg md:text-xl text-gray-500 font-medium tracking-wide uppercase mb-4">
        Software Engineer &nbsp;•&nbsp; Intelligence Analyst &nbsp;•&nbsp; Systems Thinker
      </p>

      <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8">
        I build scalable, secure software for ambitious teams — from enterprise
        platforms to AI-powered tools.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="#services"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          What I Do
        </a>
        <a
          href="#projects"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
        >
          Contact Me
        </a>
      </div>

      <a
        href="/resume.pdf"
        className="text-gray-500 underline hover:text-blue-600 text-sm mt-5 block"
        download
      >
        Download Resume
      </a>
    </section>
  );
}
