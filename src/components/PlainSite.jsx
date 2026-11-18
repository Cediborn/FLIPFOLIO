import { useReveal } from '../hooks/useReveal.js'
import Nav from './Nav.jsx'
import Hero from './Hero.jsx'
import About from './About.jsx'
import Projects from './Projects.jsx'
import Skills from './Skills.jsx'
import Philosophy from './Philosophy.jsx'
import Contact from './Contact.jsx'
import Footer from './Footer.jsx'

/** The original one-page site, kept intact for anyone who prefers scrolling. */
export default function PlainSite({ onShowBook }) {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Philosophy />
        <Contact />
      </main>
      <Footer />

      <button type="button" className="plain-toggle" onClick={onShowBook}>
        <span aria-hidden="true">&larr;</span> Back to the book
      </button>
    </>
  )
}
