import { learning, skills } from '../../data/site.js'

/** Left page of the skills spread: the three groups from site.js. */
export function SkillsPage() {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">Chapter 04</p>
      <h2 className="page-title">Skills</h2>

      <div className="book-skill-groups">
        {skills.map((group) => (
          <div key={group.title} className="book-skill-group">
            <h3>{group.title}</h3>
            <ul className="book-skill-chips">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Right page of the skills spread: what is being learned right now. */
export function LearningPage() {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">In progress</p>
      <h2 className="page-title">Learning</h2>

      <ul className="learn-list">
        {learning.map((item) => (
          <li key={item}>
            <span className="learn-dot" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <p className="page-note">
        Early in the journey, but actively building the whole way through.
      </p>
    </div>
  )
}
