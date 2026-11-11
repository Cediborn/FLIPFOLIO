import { useMemo, useState } from 'react'
import { categories, projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.jsx'

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="section-index">02</span>
          <h2>Projects</h2>
          <p className="section-note">
            Things I&rsquo;ve actually built and can point you at. Not a wishlist.
          </p>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter projects" data-reveal>
          {categories.map((c) => {
            const count =
              c.id === 'all' ? projects.length : projects.filter((p) => p.category === c.id).length
            const isActive = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                className={`filter-btn${isActive ? ' is-active' : ''}`}
                aria-pressed={isActive}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
                <span className="filter-count">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="project-grid">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} delay={Math.min(i, 5) * 100} />
          ))}
        </div>

        {visible.length === 0 && <p className="empty-note">Nothing in this category yet.</p>}
      </div>
    </section>
  )
}
