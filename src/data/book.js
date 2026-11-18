// ---------------------------------------------------------------------------
// BOOK STRUCTURE
// The book is built from the data above, never hand-written page by page.
// Each entry in `spreadDefs` is one open spread: a left page and a right page.
// Spread 0 is the closed front cover, the last spread is the back cover.
// Add a project to src/data/projects.js and it gets its own spread here.
// ---------------------------------------------------------------------------

import { nav } from './site.js'
import { projects } from './projects.js'

const spreadDefs = [
  { id: 'cover', label: 'Cover', kind: 'cover' },

  {
    id: 'about',
    label: 'About',
    pages: [{ type: 'aboutPortrait' }, { type: 'about' }],
  },
  {
    id: 'contents',
    label: 'Contents',
    pages: [{ type: 'toc' }, { type: 'tocNote' }],
  },

  ...projects.map((project, i) => ({
    id: project.id,
    label: project.name,
    pages: [
      { type: 'projectImage', project, number: i + 1, total: projects.length },
      { type: 'projectText', project, number: i + 1, total: projects.length },
    ],
  })),

  {
    id: 'skills',
    label: 'Skills & Learning',
    pages: [{ type: 'skills' }, { type: 'learning' }],
  },
  {
    id: 'contact',
    label: 'How I work & Contact',
    pages: [{ type: 'philosophy' }, { type: 'contact' }],
  },

  { id: 'back', label: 'Back cover', kind: 'back' },
]

// Flat list of physical pages: cover, then every spread's left/right page,
// then the back cover. Two consecutive entries make one physical leaf.
const flatPages = [
  { key: 'cover', type: 'cover' },
  ...spreadDefs
    .slice(1, -1)
    .flatMap((spread) =>
      spread.pages.map((page, i) => ({ ...page, key: `${spread.id}-${i}`, spreadId: spread.id })),
    ),
  // Inside of the back board: the left page of the final spread.
  { key: 'insideBack', type: 'insideBack' },
  { key: 'back', type: 'back' },
]

export const pages = flatPages

export const leaves = []
for (let i = 0; i < flatPages.length; i += 2) {
  leaves.push({ index: i / 2, front: flatPages[i], back: flatPages[i + 1] ?? null })
}

export const spreadIds = spreadDefs.map((spread) => spread.id)
export const spreadLabels = spreadDefs.map((spread) => spread.label)

// Highest spread index (0 = cover, maxSpread = back cover).
export const maxSpread = spreadIds.length - 1
// Spreads 1..10 are the numbered chapters shown in the page counter.
export const numberedSpreads = Math.max(1, maxSpread - 1)

// Where each nav entry should jump to, resolved from the data above.
const indexOfSpread = (id) => spreadIds.indexOf(id)

export const navTargets = nav.reduce((targets, item) => {
  if (item.id === 'projects') {
    targets[item.id] = Math.max(0, indexOfSpread(projects[0]?.id))
  } else {
    const index = indexOfSpread(item.id)
    targets[item.id] = index >= 0 ? index : 0
  }
  return targets
}, {})
