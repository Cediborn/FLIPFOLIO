import { identity } from '../../data/site.js'

/** Closed-book front cover: near-black board with a gold foil title. */
export function CoverPage() {
  return (
    <div className="cover-page">
      <div className="cover-top">
        <span className="cover-rule" aria-hidden="true" />
        <p className="cover-eyebrow">Portfolio</p>
      </div>

      <div className="cover-inner">
        <h1 className="cover-title">{identity.fullName.toUpperCase()}</h1>
        <p className="cover-role">{identity.role}</p>
        <p className="cover-tagline">{identity.tagline}</p>
      </div>

      <div className="cover-bottom">
        <p className="cover-hint">
          <span className="cover-dot" aria-hidden="true" />
          Click to open
        </p>
      </div>
    </div>
  )
}

/** Inside of the back board: the left page of the final spread. */
export function InsideBackCoverPage() {
  return (
    <div className="cover-page cover-page--inside">
      <div className="cover-top">
        <span className="cover-rule" aria-hidden="true" />
      </div>

      <div className="cover-inner">
        <span className="cover-mark" aria-hidden="true" />
        <p className="cover-tagline">{identity.tagline}</p>
        <p className="page-meta cover-inside-meta">
          {identity.fullName} &middot; {identity.location}
        </p>
      </div>

      <div className="cover-bottom" />
    </div>
  )
}

export function BackCoverPage({ onClose }) {
  return (
    <div className="cover-page cover-page--back">
      <div className="cover-top">
        <span className="cover-rule" aria-hidden="true" />
      </div>

      <div className="cover-inner">
        <span className="cover-mark" aria-hidden="true" />
        <h2 className="cover-back-name">{identity.fullName}</h2>
        <p className="cover-role">{identity.role}</p>
        <p className="cover-tagline">{identity.tagline}</p>
      </div>

      <div className="cover-bottom">
        <button type="button" className="cover-close" onClick={onClose}>
          Close the book
        </button>
      </div>
    </div>
  )
}
