const statusTone = {
  Live: 'live',
  Building: 'building',
  Prototype: 'prototype',
  Experiment: 'experiment',
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

      <p className="project-summary">{project.summary}</p>

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
