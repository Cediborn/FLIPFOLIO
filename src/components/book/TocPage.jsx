import { identity, nav } from '../../data/site.js'
import { navTargets } from '../../data/book.js'

/** Left page of the contents spread: every nav entry, jumpable. */
export function TocPage({ onNavigate }) {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">Index</p>
      <h2 className="page-title">Contents</h2>

      <ul className="toc-list">
        {nav.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className="toc-item"
              onClick={() => onNavigate(navTargets[item.id])}
              aria-label={`Go to ${item.label}`}
            >
              <span className="toc-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="toc-label">{item.label}</span>
              <span className="toc-arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Right page of the contents spread: how the book works. */
export function TocNotePage() {
  return (
    <div className="page-inner page-inner--center">
      <p className="page-eyebrow">How to read</p>
      <p className="toc-note">{identity.tagline}</p>

      <ul className="toc-hints">
        <li>Click a chapter on the left to flip straight to it.</li>
        <li>Click the right page to go forward, the left page to go back.</li>
        <li>Arrow keys turn pages. Home and End jump to the covers.</li>
      </ul>

      <p className="toc-sign">{identity.name}</p>
    </div>
  )
}
