import { useCallback, useEffect, useRef, useState } from 'react'
import { maxSpread, numberedSpreads, spreadIds, spreadLabels } from '../data/book.js'

const MOBILE_QUERY = '(max-width: 900px)'
const TURN_MS = 900
const STAGGER_MS = 200
const MOTION_MS = 1050

function readHash() {
  const id = window.location.hash.slice(1)
  const index = spreadIds.indexOf(id)
  return index >= 0 ? index : 0
}

/**
 * All the flip logic for the book: which leaf is turned, which half of a
 * spread is showing on mobile, keyboard/hash navigation and the little
 * bits of state the 3D animation needs (moving leaf, turning shadow,
 * open/close tilt).
 *
 * Desktop: `flipped` is the number of turned leaves, so it doubles as the
 * current spread index. Mobile shows one page at a time, which is the same
 * spread split in two halves.
 */
export function useBook() {
  const [flipped, setFlipped] = useState(readHash)
  const [half, setHalf] = useState(() => (readHash() > 0 ? 1 : 0))
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  const [moving, setMoving] = useState(() => new Set())
  const [turning, setTurning] = useState(false)
  const [motion, setMotion] = useState('')

  const state = useRef({ flipped, half })
  state.current = { flipped, half }

  const timers = useRef({ move: new Map(), turn: 0, motion: 0, chain: 0 })

  useEffect(() => {
    const moveTimers = timers.current.move
    return () => {
      moveTimers.forEach((id) => clearTimeout(id))
      clearTimeout(timers.current.turn)
      clearTimeout(timers.current.motion)
      clearInterval(timers.current.chain)
    }
  }, [])

  const markMoving = useCallback((index) => {
    if (index < 0) return
    setMoving((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
    const existing = timers.current.move.get(index)
    if (existing) clearTimeout(existing)
    timers.current.move.set(
      index,
      setTimeout(() => {
        setMoving((prev) => {
          const next = new Set(prev)
          next.delete(index)
          return next
        })
        timers.current.move.delete(index)
      }, TURN_MS),
    )
  }, [])

  const markTurning = useCallback(() => {
    setTurning(true)
    clearTimeout(timers.current.turn)
    timers.current.turn = setTimeout(() => setTurning(false), TURN_MS)
  }, [])

  const settleMotion = useCallback((kind) => {
    setMotion(kind)
    clearTimeout(timers.current.motion)
    timers.current.motion = setTimeout(() => setMotion(''), MOTION_MS)
  }, [])

  const stopChain = useCallback(() => {
    if (timers.current.chain) {
      clearInterval(timers.current.chain)
      timers.current.chain = 0
    }
  }, [])

  const halfFor = useCallback((target) => (mobile && target > 0 ? 1 : 0), [mobile])

  const commit = useCallback(
    (nextFlipped, nextHalf, direction) => {
      const from = state.current.flipped
      if (direction > 0) {
        markMoving(from)
        if (from === 0) settleMotion('open')
      } else if (direction < 0) {
        markMoving(from - 1)
        if (nextFlipped === 0) settleMotion('close')
      }
      if (direction !== 0) markTurning()
      setFlipped(nextFlipped)
      setHalf(nextHalf)
    },
    [markMoving, markTurning, settleMotion],
  )

  const next = useCallback(() => {
    stopChain()
    const { flipped: at, half: side } = state.current
    if (mobile) {
      if (side === 1) {
        // Same spread, move from the left page to the right page.
        if (at < maxSpread) commit(at, 0, 0)
        return
      }
      if (at < maxSpread) commit(at + 1, 1, 1)
      return
    }
    if (at < maxSpread) commit(at + 1, 0, 1)
  }, [commit, mobile, stopChain])

  const prev = useCallback(() => {
    stopChain()
    const { flipped: at, half: side } = state.current
    if (mobile) {
      if (side === 0) {
        if (at > 0) commit(at, 1, 0)
        return
      }
      if (at > 0) commit(at - 1, 0, -1)
      return
    }
    if (at > 0) commit(at - 1, 0, -1)
  }, [commit, mobile, stopChain])

  /** Jump straight to a spread. Far jumps flip leaves one after another. */
  const goto = useCallback(
    (target, options = {}) => {
      stopChain()
      const to = Math.max(0, Math.min(maxSpread, target))
      const from = state.current.flipped

      // A chapter jump is a new history entry, so Back returns to the spread
      // you jumped from. Jumps triggered by Back/Forward must not push again.
      if (!options.fromHistory && to !== from) {
        const hash = `#${spreadIds[to]}`
        if (window.location.hash !== hash) {
          try {
            window.history.pushState(null, '', hash)
          } catch {
            /* the URL is not writable (file://, sandboxed frame) */
          }
        }
      }

      if (options.instant || from === to) {
        setFlipped(to)
        setHalf(halfFor(to))
        return
      }

      const direction = to > from ? 1 : -1
      if (Math.abs(to - from) === 1) {
        commit(to, halfFor(to), direction)
        return
      }

      let current = from
      const step = () => {
        current += direction
        commit(current, halfFor(current), direction)
        if (current === to) stopChain()
      }
      step()
      timers.current.chain = setInterval(step, STAGGER_MS)
    },
    [commit, halfFor, stopChain],
  )

  const close = useCallback(() => goto(0), [goto])

  // --- deep links ---------------------------------------------------------
  useEffect(() => {
    const hash = `#${spreadIds[flipped]}`
    if (window.location.hash === hash) return
    try {
      window.history.replaceState(null, '', hash)
    } catch {
      /* ignore — the URL is not writable (file://, sandboxed frame) */
    }
  }, [flipped])

  useEffect(() => {
    const onHashChange = () => {
      const index = spreadIds.indexOf(window.location.hash.slice(1))
      if (index >= 0) goto(index, { fromHistory: true })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [goto])

  // --- one page at a time on small screens --------------------------------
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const onChange = (event) => {
      setMobile(event.matches)
      setHalf(0)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // --- keyboard -----------------------------------------------------------
  useEffect(() => {
    function onKeyDown(event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          prev()
          break
        case 'Home':
          event.preventDefault()
          goto(0)
          break
        case 'End':
          event.preventDefault()
          goto(maxSpread)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, prev, goto])

  const isCover = flipped === 0
  const isBack = flipped === maxSpread
  const label = isCover ? 'Front cover' : isBack ? 'Back cover' : `Spread ${flipped} of ${numberedSpreads}`
  const chapter = isCover || isBack ? '' : spreadLabels[flipped]

  const canPrev = flipped > 0
  const canNext = flipped < maxSpread

  return {
    flipped,
    half,
    mobile,
    moving,
    turning,
    motion,
    isOpen: flipped > 0,
    canPrev,
    canNext,
    next,
    prev,
    goto,
    close,
    label,
    chapter,
    announcement: [label, chapter].filter(Boolean).join(' — '),
  }
}
