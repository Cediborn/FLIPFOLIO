import { useCallback, useState } from 'react'
import Book from './components/book/Book.jsx'
import PlainSite from './components/PlainSite.jsx'

export default function App() {
  const [plain, setPlain] = useState(false)

  const showPlain = useCallback(() => {
    // Drop any spread hash so the scrolling layout doesn't jump to a section.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setPlain(true)
    window.scrollTo({ top: 0 })
  }, [])

  const showBook = useCallback(() => setPlain(false), [])

  return plain ? <PlainSite onShowBook={showBook} /> : <Book onShowPlain={showPlain} />
}
