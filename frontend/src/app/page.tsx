import About from "./components/About";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";

export default function HomePage() {
  return (
    <main className="bg-gray-50 text-gray-900 scroll-smooth">
      <Header />

      <section id="hero">
        <Hero />
      </section>
      <section id="about" className="py-16">
        <About />
      </section>
      <section id="projects" className="py-16 bg-white">
        <Projects />
      </section>
      {/* <section id="experience" className="py-16">
        <Experience />
      </section>
      <section id="skills" className="py-16 bg-white">
        <Skills />
      </section>
      <section id="martial-arts" className="py-16">
        <MartialArts />
      </section> */}
      <section id="contact" className="py-16 bg-white">
        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}
