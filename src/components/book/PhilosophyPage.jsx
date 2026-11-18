import { philosophy } from '../../data/site.js'

/** Left page of the last spread: how the work gets made. */
export default function PhilosophyPage() {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">Chapter 05</p>
      <h2 className="page-title">How I work</h2>

      <ol className="phil-list">
        {philosophy.map((item, i) => (
          <li key={item.title} className="phil-item">
            <span className="phil-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
