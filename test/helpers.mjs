// Shared fixtures for the check tests. Not a test file itself.
export const GOOD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Fixture</title>
</head>
<body>
<header class="nav">
  <a href="#top">Built by Seven</a>
  <nav>
    <a href="#work">Work</a>
    <a href="#services">Services</a>
    <a href="#process">Process</a>
    <a href="#faq">FAQ</a>
    <a href="#about">About</a>
  </nav>
  <a href="tel:+14807574367">Text or call</a>
</header>
<main id="main">
  <section class="hero" id="top" aria-labelledby="hero-title">
    <h1 id="hero-title">I build <em>things</em> well.</h1>
  </section>
  <section class="work" id="work"><h2>Work</h2><h3>One</h3><img src="/a.png" alt="A" width="10" height="10"></section>
  <section class="services" id="services"><h2>Services</h2></section>
  <section class="process" id="process"><h2>Process</h2></section>
  <section class="faq" id="faq"><h2>FAQ</h2></section>
  <section class="testimonials" id="testimonials"><h2>Owners</h2><blockquote>"A quote"</blockquote></section>
  <section class="about" id="about"><h2>About</h2><p>Plain text.</p></section>
</main>
<footer class="footer" id="contact"><a href="tel:+14807574367">Call</a></footer>
</body>
</html>
`;

export const GOOD_CSS = [
  { name: 'base.css', text: ':root{--ink:#1B1815;--hairline:rgba(27,24,21,.18)} body{color:var(--ink)}' },
  { name: 'top.css', text: '.hero{color:var(--copper);border-bottom:1px solid var(--hairline)}' },
  { name: 'bottom.css', text: '.faq{background:color-mix(in srgb, var(--ink) 10%, transparent)}' },
];

// Returns GOOD with the first occurrence of `from` replaced by `to`. Throws if `from` is not found,
// so a fixture can never silently test nothing.
export function mutate(from, to, html = GOOD) {
  if (!html.includes(from)) throw new Error(`fixture does not contain: ${from}`);
  return html.replace(from, to);
}
