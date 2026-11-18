import { education, identity } from '../../data/site.js'

/** Left page of the About spread: the portrait, name and location. */
export function AboutPortraitPage() {
  return (
    <div className="page-inner page-inner--portrait">
      <picture className="book-portrait">
        <source srcSet={`${import.meta.env.BASE_URL}me.webp`} type="image/webp" />
        <img
          src={`${import.meta.env.BASE_URL}me.jpg`}
          alt={`Portrait of ${identity.name}`}
          width="512"
          height="512"
          decoding="async"
        />
      </picture>

      <div className="portrait-caption">
        <h2 className="page-name">{identity.name}</h2>
        <p className="page-meta">{identity.location}</p>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="page-inner">
      <p className="page-eyebrow">Chapter 01</p>
      <h2 className="page-title">About</h2>

      <p className="page-lede">{identity.role}</p>

      <p className="page-body">
        I&rsquo;m a first-year Computer Science student at the University of Ghana who spends a lot
        of time turning ideas into working software.
      </p>
      <p className="page-body">
        Most of what I know came from building things I actually wanted to use: a football game that
        plays in the browser, a budgeting tool shaped around student life in Ghana, a discovery app
        that filters by what you can afford.
      </p>

      <div className="page-edu">
        <p className="page-edu-label">Education</p>
        <h3>{education.institution}</h3>
        <p className="page-edu-line">{education.degree}</p>
        <p className="page-edu-line">{education.level}</p>
        <p className="page-edu-focus">{education.focus}</p>
      </div>
    </div>
  )
}
