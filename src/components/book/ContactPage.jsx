import { identity, links } from '../../data/site.js'

const hasEmail = typeof links.email === 'string' && links.email.trim().length > 0

/** Right page of the last spread: the real contact options, no dead links. */
export default function ContactPage() {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">Contact</p>
      <h2 className="page-title">Let&rsquo;s build something.</h2>

      <p className="page-body">
        Working on something, need a hand with a small build, or just want to compare notes on web
        and game development? I read everything that comes through.
      </p>

      <div className="page-actions">
        <a
          className="page-btn page-btn--gold"
          href={links.github}
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub <span aria-hidden="true">&#8599;</span>
        </a>
        {hasEmail && (
          <a className="page-btn" href={`mailto:${links.email}`}>
            Email me
          </a>
        )}
      </div>

      <p className="page-meta">
        {identity.name} &middot; {identity.location} &middot; open to internships, collaborations
        and side projects.
      </p>

      <p className="page-signoff">Thanks for flipping through.</p>
    </div>
  )
}
