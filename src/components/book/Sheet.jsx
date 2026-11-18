/**
 * One physical leaf of the book: a front face (right page when unflipped)
 * and a back face (left page once turned). Faces that are not part of the
 * open spread are inert, so tab order and screen readers only see the
 * spread you are actually looking at.
 */
export default function Sheet({
  isFlipped,
  isMoving,
  zIndex,
  front,
  back,
  frontTone = 'paper',
  backTone = 'paper',
  frontLive,
  backLive,
}) {
  return (
    <div
      className={`sheet${isFlipped ? ' is-flipped' : ''}${isMoving ? ' is-moving' : ''}`}
      style={{ zIndex }}
    >
      <div className="sheet-face sheet-front" inert={!frontLive}>
        <div className={`page page--${frontTone}`}>{front}</div>
      </div>
      <div className="sheet-face sheet-back" inert={!backLive}>
        <div className={`page page--${backTone}`}>{back}</div>
      </div>
    </div>
  )
}
