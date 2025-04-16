export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-white via-blue-50 to-white">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        DeJuan Spencer
      </h1>

      <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-6">
        Software Engineer • Intelligence Analyst • Systems Thinker
        <br />
        Building scalable, secure apps at the intersection of tech and strategy.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="#projects"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
        >
          Contact Me
        </a>
        <a
          href="../DeJuan Spencer Resume.docx"
          className="text-gray-600 underline hover:text-blue-600 text-sm pt-2 md:pt-3 block"
          download
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}
