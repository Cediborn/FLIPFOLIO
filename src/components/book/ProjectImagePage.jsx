import ProjectVisual from '../ProjectVisual.jsx'

/**
 * Left page of a project spread: the real screenshot when the project has
 * one, otherwise the matching inline SVG from ProjectVisual.
 */
export default function ProjectImagePage({ project, number, total, eager = false }) {
  const { image } = project

  return (
    <div className="page-inner page-inner--image">
      <div className="project-frame">
        {image ? (
          <picture>
            {image.webp && (
              <source srcSet={import.meta.env.BASE_URL + image.webp} type="image/webp" />
            )}
            <img
              src={import.meta.env.BASE_URL + image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        ) : (
          <ProjectVisual project={project} />
        )}
      </div>

      <p className="project-caption">
        <span className="project-caption-num">{String(number).padStart(2, '0')}</span>
        <span className="project-caption-name">{project.name}</span>
        <span className="project-caption-total">/ {String(total).padStart(2, '0')}</span>
      </p>
    </div>
  )
}
