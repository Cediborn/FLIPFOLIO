import { useEffect, useRef, useState } from 'react'
import ProjectVisual from './ProjectVisual.jsx'

const statusTone = {
  Live: 'live',
  Building: 'building',
  Prototype: 'prototype',
  Experiment: 'experiment',
}

/**
 * One project card as a device mockup.
 *
 * The deployed app is mounted in an iframe only once the card is close to the
 * viewport. Until (and unless) that iframe loads, the screenshot or placeholder
 * SVG behind it stays visible, so a blocked or slow site never leaves a blank
 * screen. Hovering dims the phone and slides the description over it; the
 * featured game stays live and playable instead.
 */
export default function ProjectCard({ project, index, delay = 0 }) {
  const cardRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [liveSrc, setLiveSrc] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const featured = Boolean(project.featured)
  const tone = statusTone[project.status] ?? 'experiment'

  useEffect(() => {
    if (!project.liveUrl) return undefined
    const node = cardRef.current
    if (!node || !('IntersectionObserver' in window)) {
      setLiveSrc(project.liveUrl)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setLiveSrc(project.liveUrl)
        observer.disconnect()
      },
      { rootMargin: '300px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [project.liveUrl])

  useEffect(() => {
    if (!open && !playing) return undefined
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      setOpen(false)
      setPlaying(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, playing])

  function handleStageClick(event) {
    if (event.target.closest('a, button, iframe')) return
    setOpen((value) => !value)
  }

  function startPlaying() {
    setOpen(false)
    setPlaying(true)
  }

  const actions = (
    <div className="project-actions">
      {project.liveUrl ? (
        <a className="btn btn-primary btn-sm" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
          Live Demo <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <span className="btn btn-sm btn-disabled" title="Not public yet">
          In progress
        </span>
      )}
      {project.githubUrl && (
        <a className="btn btn-ghost btn-sm" href={project.githubUrl} target="_blank" rel="noreferrer noopener">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      )}
      {!featured && project.liveUrl && (
        <button className="btn btn-ghost btn-sm" type="button" onClick={startPlaying}>
          Try it
        </button>
      )}
    </div>
  )

  const tags = (
    <ul className="tag-list">
      {project.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )

  const cardClass = [
    'project-card',
    'project-card--device',
    featured ? 'project-card--featured project-card--playable' : '',
    open ? 'is-open' : '',
    playing ? 'is-playing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article ref={cardRef} className={cardClass} data-reveal style={{ '--delay': `${delay}ms` }}>
      <div
        className={featured ? 'project-media project-media--device' : 'project-stage'}
        onClick={featured ? undefined : handleStageClick}
      >
        <span className={`status status-${tone}`}>
          <span className="status-dot" aria-hidden="true" />
          {project.status}
        </span>

        <div className="device-wrap">
          <div className={`device ${featured ? 'device-landscape' : 'device-portrait'}`}>
            <div className="device-frame">
              <div className="device-screen">
                <span className="device-island" aria-hidden="true" />

                <div className="device-shot">
                  <ProjectVisual project={project} />
                </div>

                {project.liveUrl && (
                  <iframe
                    className={`device-live${loaded ? ' is-loaded' : ''}`}
                    src={liveSrc ?? undefined}
                    title={`${project.name} — live demo`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </div>

              <span className="device-btn device-btn--volume" aria-hidden="true" />
              <span className="device-btn device-btn--power" aria-hidden="true" />
            </div>
          </div>
        </div>

        {!featured && (
          <>
            <button
              className="device-exit"
              type="button"
              hidden={!playing}
              onClick={() => setPlaying(false)}
            >
              Back
            </button>

            <div className="project-overlay">
              <button
                className="overlay-close"
                type="button"
                aria-label="Hide project details"
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div className="overlay-inner">
                <p className="project-summary">{project.summary}</p>
                {tags}
                {actions}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="project-body">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          <span className="project-num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {featured && (
          <>
            <p className="project-summary">{project.summary}</p>
            {tags}
            {actions}
          </>
        )}
      </div>
    </article>
  )
}
