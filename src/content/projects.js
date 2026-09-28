// Every film on the site, in two categories. The Work page shows one category at a time,
// in the order below; films marked `lead` come first and play biggest.
//
// category:  'motion' or 'edit' (see `categories` below)
// shape:     how the film is framed: 'wide' (16:9), 'square' or 'tall' (9:16, the phone edits)
// film:
//   src      the full film: plays with sound in the player, and on a case study page
//   preview  a short silent loop that plays on its card
//   poster   the still shown before either loads
//   start    second the full film opens on when it autoplays muted (skips slow fade-ins)
// summary:   the line under the film
// caseStudy: gives the project its own page at /projects/<slug>. Films without one open
//            in the player instead.

export const categories = [
  { id: 'motion', path: '/projects', name: 'Motion design', line: 'Built from a blank comp, in After Effects and Premiere Pro for Sound Design.' },
  { id: 'edit', path: '/projects/editing', name: 'Video editing', line: 'Cut from real footage, in Premiere Pro and After Effects.' },
]

export const projects = [
  // ---- Motion design ----
  {
    slug: 'grab-malaysia',
    name: 'Grab Malaysia',
    client: 'Grab',
    category: 'motion',
    lead: true,
    shape: 'wide',
    film: { src: 'media/films/grab.mp4', preview: 'media/films/grab-preview.mp4', poster: 'media/films/grab.jpg', start: 17.8 },
    summary: 'Concept ad for Grab Malaysia',
    caseStudy: {
      discipline: 'Motion graphics',
      year: 2026,
      description: [
        'Motion graphics for Grab Malaysia, a Southeast Asian super-app that needed its campaign visuals to move with the same energy as its platform. Fast, clear, confident.',
        'The piece had to work across formats and markets at once, which shaped every decision from the typography stack to the transition language.',
      ],
      process: 'High-velocity pacing matched to Grab’s brand rhythm. Colour transitions carry narrative weight: each section shift marks a new product tier without stopping the momentum.',
      tools: 'After Effects for motion. Illustrator for assets. Premiere Pro for the final cut.',
      // Markers under the film. `t` is the second to jump to.
      chapters: [
        { t: 1.6, label: 'Need a ride?', thumb: 'media/chapters/grab-01.jpg' },
        { t: 8.1, label: 'Your location', thumb: 'media/chapters/grab-02.jpg' },
        { t: 14.6, label: 'Where to', thumb: 'media/chapters/grab-03.jpg' },
        { t: 21.0, label: 'Book', thumb: 'media/chapters/grab-04.jpg' },
        { t: 27.5, label: 'Live tracking', thumb: 'media/chapters/grab-05.jpg' },
        { t: 37.2, label: 'End card', thumb: 'media/chapters/grab-06.jpg' },
      ],
      // Working files or frames shown under the text. Leave [] to hide the section.
      stills: [],
    },
  },
  {
    slug: 'beyond-media-intro',
    name: 'Beyond Media intro',
    client: 'Beyond Media',
    category: 'motion',
    lead: true,
    shape: 'wide',
    film: { src: 'media/films/beyond-media.mp4', preview: 'media/films/beyond-media-preview.mp4', poster: 'media/films/beyond-media.jpg' },
    summary: 'Intro sequence for a Beyond Media Creative Studio',
  },
  {
    slug: 'google-gemini',
    name: 'Google Gemini',
    client: 'Google',
    category: 'motion',
    shape: 'wide',
    film: { src: 'media/films/gemini.mp4', preview: 'media/films/gemini-preview.mp4', poster: 'media/films/gemini.jpg', start: 2.8 },
    summary: 'Picking a model and getting an answer, any time, anywhere.',
  },
  {
    slug: 'social-ui-animation',
    name: 'Social UI',
    client: 'UGC Creator',
    category: 'motion',
    shape: 'wide',
    film: { src: 'media/films/social-ui.mp4', preview: 'media/films/social-ui-preview.mp4', poster: 'media/films/social-ui.jpg', start: 6.2 },
    summary: 'A clean Social Profiles animation for in video purposes',
  },
  {
    slug: 'pinterest',
    name: 'Pinterest',
    client: 'Pinterest',
    category: 'motion',
    shape: 'square',
    film: { src: 'media/films/pinterest.mp4', preview: 'media/films/pinterest-preview.mp4', poster: 'media/films/pinterest.jpg' },
    summary: 'A reimagined Pinterest inspiration animation ',
  },

  // ---- Video editing ----
  {
    slug: 'apu',
    name: 'Welcome to APU',
    client: 'Asia Pacific University',
    category: 'edit',
    lead: true,
    shape: 'tall',
    film: { src: 'media/films/apu.mp4', preview: 'media/films/apu-preview.mp4', poster: 'media/films/apu.jpg' },
    summary: 'Asia Pacific University intake video edit. After effects and Premiere Pro',
  },
  {
    slug: 'g-wagon',
    name: 'G-Wagon',
    client: 'Sample Edit',
    category: 'edit',
    lead: true,
    shape: 'tall',
    film: { src: 'media/films/g-wagon.mp4', preview: 'media/films/g-wagon-preview.mp4', poster: 'media/films/g-wagon.jpg' },
    summary: 'Smooth Mercedes AMG edit. Speedramp and VFX',
  },
  {
    slug: 'tina-and-co-studios',
    name: 'Tina and Co Studios',
    client: 'Creative Studio',
    category: 'edit',
    shape: 'tall',
    film: { src: 'media/films/tina-and-co.mp4', preview: 'media/films/tina-and-co-preview.mp4', poster: 'media/films/tina-and-co.jpg' },
    summary: 'Creative Studio startup video edit',
  },
  {
    slug: 'sempero',
    name: 'Sempero',
    client: 'Sample Edit',
    category: 'edit',
    shape: 'tall',
    film: { src: 'media/films/sempero.mp4', preview: 'media/films/sempero-preview.mp4', poster: 'media/films/sempero.jpg' },
    summary: 'A BMW 5 Series speedramp VFX and typography edit',
  },
  {
    slug: 'mrt-edit',
    name: 'MRT',
    client: 'Sample Edit',
    category: 'edit',
    shape: 'tall',
    film: { src: 'media/films/mrt.mp4', preview: 'media/films/mrt-preview.mp4', poster: 'media/films/mrt.jpg' },
    summary: 'Handheld and shot on a smartphone. Speedramp and VFX edit',
  },
]

export const findProject = slug => projects.find(p => p.slug === slug)
export const categoryOf = p => categories.find(c => c.id === p.category) || categories[0]

// The frame for each shape, as a CSS aspect ratio.
export const ratios = { wide: '16 / 9', square: '1 / 1', tall: '9 / 16' }

// Media objects for <Media />: the full film, or the short silent loop for cards.
export const filmOf = p => (p?.film ? { type: 'video', src: p.film.src, poster: p.film.poster, start: p.film.start } : null)
export const previewOf = p => (p?.film ? { type: 'video', src: p.film.preview || p.film.src, poster: p.film.poster } : null)

// Where a link to a project goes: its case study, or its category's page with the film open.
export const linkTo = p => (p.caseStudy ? { to: `/projects/${p.slug}` } : { to: categoryOf(p).path, state: { play: p.slug } })
