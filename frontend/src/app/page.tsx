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
    <main className="scroll-smooth" style={{ background: "var(--brand-foundation)", color: "var(--text-primary)" }}>
      <Header />

      <section id="hero">
        <Hero />
      </section>

      <section id="services" className="py-20" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <Services />
      </section>

      <section id="about" className="py-20" style={{ background: "var(--section-alt)", borderTop: "1px solid var(--border-subtle)" }}>
        <About />
      </section>

      <section id="projects" className="py-20" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <Projects />
      </section>

      <section id="experience" className="py-20" style={{ background: "var(--section-alt)", borderTop: "1px solid var(--border-subtle)" }}>
        <Experience />
      </section>

      <section id="skills" className="py-20" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <Skills />
      </section>

      <section id="martial-arts" className="py-20" style={{ background: "var(--section-alt)", borderTop: "1px solid var(--border-subtle)" }}>
        <MartialArts />
      </section>

      <section id="contact" className="py-20" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <ContactForm />
      </section>

      <Footer />
    </main>
  );
}
