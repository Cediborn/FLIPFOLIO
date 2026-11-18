/** Prev / Next, the page counter and the plain-page escape hatch. */
export default function BookControls({
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClose,
  onShowPlain,
  label,
  chapter,
  isOpen,
}) {
  return (
    <div className="book-controls">
      <div className="book-controls-group">
        <button
          type="button"
          className="book-ctl"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          <span aria-hidden="true">&larr;</span> Prev
        </button>
        <button
          type="button"
          className="book-ctl book-ctl--primary"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next page"
        >
          Next <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <p className="book-counter">
        {label}
        {chapter ? <span className="book-counter-chapter"> &middot; {chapter}</span> : null}
      </p>

      <div className="book-controls-group book-controls-group--end">
        {isOpen && (
          <button type="button" className="book-ctl book-ctl--ghost" onClick={onClose}>
            Close book
          </button>
        )}
        <button type="button" className="book-ctl book-ctl--ghost" onClick={onShowPlain}>
          View as plain page
        </button>
      </div>
    </div>
  )
}
