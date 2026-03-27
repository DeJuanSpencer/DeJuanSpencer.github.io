import About from "./components/About";
import ContactForm from "./components/ContactForm";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MartialArts from "./components/MartialArts";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Skills from "./components/Skills";

export default function HomePage() {
  return (
    <main className="bg-gray-50 text-gray-900 scroll-smooth">
      <Header />

      <section id="hero">
        <Hero />
      </section>

      <section id="services" className="py-20 bg-white border-t border-gray-100">
        <Services />
      </section>

      <section id="about" className="py-20 border-t border-gray-100">
        <About />
      </section>

      <section id="projects" className="py-20 bg-white border-t border-gray-100">
        <Projects />
      </section>

      <section id="experience" className="py-20 border-t border-gray-100">
        <Experience />
      </section>

      <section id="skills" className="py-20 bg-white border-t border-gray-100">
        <Skills />
      </section>

      <section id="martial-arts" className="py-14 border-t border-gray-100">
        <MartialArts />
      </section>

      <section id="contact" className="py-20 bg-white border-t border-gray-100">
        <ContactForm />
      </section>

      <Footer />
    </main>
  );
}
