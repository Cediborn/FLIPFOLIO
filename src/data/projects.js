// ---------------------------------------------------------------------------
// PROJECT DATA
// Everything about the projects shown on the site lives here.
// To add a project: copy a block, fill it in, pick a `visual` key.
// Add an `image` block (files live in public/) to show a real screenshot
// instead of the placeholder SVG.
// To remove a link you don't have (e.g. no GitHub repo yet): set it to null —
// the button is hidden automatically.
// ---------------------------------------------------------------------------

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'game', label: 'Games' },
  { id: 'web', label: 'Web' },
  { id: 'experiment', label: 'Experiments' },
]

export const projects = [
  {
    id: 'blackout',
    name: 'BLACKOUT',
    // status: one of 'Live' | 'Building' | 'Prototype' | 'Experiment'
    status: 'Live',
    category: 'game',
    summary:
      'A browser-based street football game built around fast matches, urban environments, AI-controlled players and mobile-friendly controls. I build the gameplay systems, environments, UI, animations and audio myself while experimenting with lightweight web tech.',
    tags: ['Browser game', 'Gameplay systems', 'Mobile controls'],
    liveUrl: 'https://blockout-mauve.vercel.app',
    githubUrl: 'https://github.com/Cediborn/BLOCKOUT',
    visual: 'pitch',
    image: {
      src: 'blackout.png',
      webp: 'blackout.webp',
      width: 1280,
      height: 585,
      alt: 'BLACKOUT in play: a floodlit street football cage, two teams of three and the on-screen match controls',
    },
    featured: true,
  },
  {
    id: 'balancio',
    name: 'Balancio',
    status: 'Live',
    category: 'web',
    summary:
      'A budgeting concept aimed at Ghanaian students and young adults, built on the idea that a budget should fit a student\u2019s life instead of the other way round. A practical prototype for organising money without juggling spreadsheets.',
    tags: ['Personal finance', 'Student budgeting', 'Ghana-focused'],
    liveUrl: 'https://balancio-eta.vercel.app',
    githubUrl: null,
    visual: 'ledger',
    image: {
      src: 'balancio.png',
      webp: 'balancio.webp',
      width: 1280,
      height: 585,
      alt: 'Balancio home screen with a GH\u20B5235.00 balance and a plain-language expense box',
    },
  },
  {
    id: 'bambi',
    name: 'Bambi',
    status: 'Live',
    category: 'web',
    summary:
      'A teen growth and personal-development app with a companion feel. I\u2019m exploring how a product can feel supportive rather than clinical, with characters like Sora, Koda and Ziggy carrying the experience.',
    tags: ['Personal growth', 'Interactive experience', 'Characters'],
    liveUrl: 'https://bambi-jam.vercel.app',
    githubUrl: null,
    visual: 'growth',
    image: {
      src: 'bambi.png',
      webp: 'bambi.webp',
      width: 1280,
      height: 585,
      alt: 'Bambi Today screen with a daily quest, XP, day streak and level',
    },
  },
  {
    id: 'locallens',
    name: 'LocalLens',
    status: 'Live',
    category: 'web',
    summary:
      'A local discovery interface built around practical criteria — how far away a place is, what it costs and how it\u2019s rated. Less of a list of places, more of an answer to \u201cwhat actually fits right now?\u201d.',
    tags: ['Discovery tool', 'Practical criteria', 'Interface design'],
    liveUrl: 'https://locallens-tan.vercel.app',
    githubUrl: null,
    visual: 'radius',
    image: {
      src: 'localens.png',
      webp: 'localens.webp',
      width: 1280,
      height: 585,
      alt: 'LocalLens landing screen with a find things near me button and OpenStreetMap badge',
    },
  },
  {
    id: 'atlas',
    name: 'Atlas',
    status: 'Experiment',
    category: 'experiment',
    summary:
      'A lightweight static progressive web app experiment. No backend, no heavy framework, no external AI — just vanilla JavaScript and a PWA approach, to see how far a simple static architecture can be pushed.',
    tags: ['PWA', 'Vanilla JavaScript', 'No backend'],
    liveUrl: 'https://oc-atlas-mauve.vercel.app',
    githubUrl: null,
    visual: 'grid',
  },
  {
    id: 'the-council',
    name: 'The Council',
    status: 'Experiment',
    category: 'experiment',
    summary:
      'A concept for AI decision support that hands you several perspectives instead of one agreeable answer. Still in progress — the interesting part is designing an interface for thinking, not just chatting.',
    tags: ['AI interaction', 'Decision support', 'Concept'],
    liveUrl: null,
    githubUrl: null,
    visual: 'council',
  },
]
