import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const statusTone = {
  Live: 'live',
  Building: 'building',
  Prototype: 'prototype',
  Experiment: 'experiment',
}

/**
 * The summary is clamped to a handful of lines. Only when the real copy is
 * taller than the clamp do we offer "Read more", so nothing is ever hidden
 * behind a page scrollbar by default.
 */
function ProjectSummary({ text }) {
  const ref = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [clipped, setClipped] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || expanded) return
    setClipped(el.scrollHeight - el.clientHeight > 1)
  }, [expanded, text])

  // Re-measure when the page changes size (window resize, rotate).
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      if (expanded) return
      setClipped(el.scrollHeight - el.clientHeight > 1)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded])

  return (
    <>
      <p ref={ref} className={`project-summary${expanded ? ' is-expanded' : ''}`}>
        {text}
      </p>
      {(clipped || expanded) && (
        <button
          type="button"
          className="summary-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </>
  )
}

/** Right page of a project spread: name, status, summary, tags, links. */
export default function ProjectTextPage({ project, number }) {
  const tone = statusTone[project.status] ?? 'experiment'

  return (
    <div className="page-inner">
      <p className="page-eyebrow">Project {String(number).padStart(2, '0')}</p>
      <h2 className="page-title page-title--project">{project.name}</h2>

      <span className={`book-badge book-badge--${tone}`}>
        <span className="book-badge-dot" aria-hidden="true" />
        {project.status}
      </span>

      <ProjectSummary text={project.summary} />

      <ul className="book-tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      {(project.liveUrl || project.githubUrl) && (
        <div className="page-actions">
          {project.liveUrl && (
            <a
              className="page-btn page-btn--gold"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Live <span aria-hidden="true">&#8599;</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              className="page-btn"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub <span aria-hidden="true">&#8599;</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
