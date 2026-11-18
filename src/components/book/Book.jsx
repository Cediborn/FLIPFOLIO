import { useEffect, useRef } from 'react'
import { leaves, maxSpread } from '../../data/book.js'
import { useBook } from '../../hooks/useBook.js'
import Sheet from './Sheet.jsx'
import BookControls from './BookControls.jsx'
import { CoverPage, InsideBackCoverPage, BackCoverPage } from './CoverPage.jsx'
import { AboutPage, AboutPortraitPage } from './AboutPage.jsx'
import { TocPage, TocNotePage } from './TocPage.jsx'
import ProjectImagePage from './ProjectImagePage.jsx'
import ProjectTextPage from './ProjectTextPage.jsx'
import { SkillsPage, LearningPage } from './SkillsPage.jsx'
import PhilosophyPage from './PhilosophyPage.jsx'
import ContactPage from './ContactPage.jsx'

function PageBody({ page, onNavigate, onClose }) {
  if (!page) return <div className="page-inner" aria-hidden="true" />

  switch (page.type) {
    case 'cover':
      return <CoverPage />
    case 'back':
      return <BackCoverPage onClose={onClose} />
    case 'insideBack':
      return <InsideBackCoverPage />
    case 'aboutPortrait':
      return <AboutPortraitPage />
    case 'about':
      return <AboutPage />
    case 'toc':
      return <TocPage onNavigate={onNavigate} />
    case 'tocNote':
      return <TocNotePage />
    case 'projectImage':
      return (
        <ProjectImagePage
          project={page.project}
          number={page.number}
          total={page.total}
          eager={page.number === 1}
        />
      )
    case 'projectText':
      return <ProjectTextPage project={page.project} number={page.number} />
    case 'skills':
      return <SkillsPage />
    case 'learning':
      return <LearningPage />
    case 'philosophy':
      return <PhilosophyPage />
    case 'contact':
      return <ContactPage />
    default:
      return null
  }
}

const coverTypes = new Set(['cover', 'insideBack', 'back'])
const toneFor = (page) => (page && coverTypes.has(page.type) ? 'cover' : 'paper')

export default function Book({ onShowPlain }) {
  const {
    flipped,
    half,
    mobile,
    moving,
    turning,
    motion,
    isOpen,
    canPrev,
    canNext,
    next,
    prev,
    goto,
    close,
    label,
    chapter,
    announcement,
  } = useBook()

  const bookRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)

  // Which half of the book is in view: a whole spread, or one page on mobile.
  const view = mobile ? (half === 1 ? 'left' : 'right') : flipped === 0 ? 'right' : 'spread'

  // If focus was inside a page that just went inert, move it back to the book.
  useEffect(() => {
    const active = document.activeElement
    if (!active || active === document.body) return
    if (!bookRef.current?.contains(active)) return
    if (active.closest('[inert]')) bookRef.current.focus({ preventScroll: true })
  }, [flipped, half])

  function handleClick(event) {
    if (event.target.closest('a, button, input, select, textarea')) return
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }

    if (mobile) {
      if (canNext) next()
      else if (!isOpen) close()
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    if (x < rect.width / 2) prev()
    else next()
  }

  function handlePointerDown(event) {
    if (event.target.closest('a, button')) return
    drag.current = { x: event.clientX, y: event.clientY }
  }

  function handlePointerUp(event) {
    const start = drag.current
    drag.current = null
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return

    suppressClick.current = true
    setTimeout(() => {
      suppressClick.current = false
    }, 400)

    if (dx < 0) next()
    else prev()
  }

  return (
    <div className={`book-app${motion ? ` is-${motion}` : ''}`}>
      <div className="book-glow" aria-hidden="true" />

      <div className="book-stage">
        <div className="book-shadow" aria-hidden="true" />

        <div className="book-window">
          <div className="book-scene">
            <div
            ref={bookRef}
            className={`book${turning ? ' is-turning' : ''}${motion ? ` is-${motion}` : ''}`}
            data-view={view}
            role="group"
            aria-label="Portfolio book"
            tabIndex={-1}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              drag.current = null
            }}
          >
            <div
              className="book-stack book-stack--left"
              style={{ '--stack': flipped }}
              aria-hidden="true"
            />
            <div
              className="book-stack book-stack--right"
              style={{ '--stack': maxSpread - flipped }}
              aria-hidden="true"
            />

            {leaves.map((leaf) => {
              const isFlipped = leaf.index < flipped
              const isMoving = moving.has(leaf.index)
              const zIndex = isMoving ? 2000 : isFlipped ? 500 + leaf.index : 1000 - leaf.index

              const frontLive = mobile
                ? leaf.index === flipped && half === 0
                : leaf.index === flipped
              const backLive = mobile
                ? leaf.index === flipped - 1 && half === 1
                : leaf.index === flipped - 1

              return (
                <Sheet
                  key={leaf.index}
                  isFlipped={isFlipped}
                  isMoving={isMoving}
                  zIndex={zIndex}
                  front={<PageBody page={leaf.front} onNavigate={goto} onClose={close} />}
                  back={<PageBody page={leaf.back} onNavigate={goto} onClose={close} />}
                  frontTone={toneFor(leaf.front)}
                  backTone={toneFor(leaf.back)}
                  frontLive={frontLive}
                  backLive={backLive}
                />
              )
            })}

              <div className="turn-shadow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <BookControls
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
        onClose={close}
        onShowPlain={onShowPlain}
        label={label}
        chapter={chapter}
        isOpen={isOpen}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
