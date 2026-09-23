// Every project on the site. Order here = order on the Projects page.
//
// film:     the main video. Set to null until the film is ready: the site shows a placeholder frame.
//   src     path inside /public (e.g. 'media/films/grab.mp4')
//   poster  still shown before the video loads
//   start   second the film opens on when it autoplays (skips slow fade-ins)
//   loop    short clip used for hover previews (optional)
// chapters: markers under the film on the project page. `t` is the second to jump to.
// stills:   working files or frames shown under the text. Leave [] to hide the section.

export const projects = [
  {
    slug: 'grab-malaysia',
    name: 'Grab Malaysia',
    client: 'Grab',
    discipline: 'Motion graphics',
    year: 2026,
    length: '0:38',
    film: {
      src: 'media/films/grab.mp4',
      poster: 'media/films/grab-poster.jpg',
      start: 17.8,
      loop: 'media/films/grab-loop.mp4',
    },
    summary: 'Campaign visuals that move with the same energy as the platform. Fast, clear, confident.',
    description: [
      'Motion graphics for Grab Malaysia, a Southeast Asian super-app that needed its campaign visuals to move with the same energy as its platform. Fast, clear, confident.',
      'The piece had to work across formats and markets at once, which shaped every decision from the typography stack to the transition language.',
    ],
    process: 'High-velocity pacing matched to Grab’s brand rhythm. Colour transitions carry narrative weight: each section shift marks a new product tier without stopping the momentum.',
    tools: 'After Effects for motion. Illustrator for assets. Premiere Pro for the final cut.',
    chapters: [
      { t: 1.6, label: 'Need a ride?', thumb: 'media/chapters/grab-01.jpg' },
      { t: 8.1, label: 'Your location', thumb: 'media/chapters/grab-02.jpg' },
      { t: 14.6, label: 'Where to', thumb: 'media/chapters/grab-03.jpg' },
      { t: 21.0, label: 'Book', thumb: 'media/chapters/grab-04.jpg' },
      { t: 27.5, label: 'Live tracking', thumb: 'media/chapters/grab-05.jpg' },
      { t: 37.2, label: 'End card', thumb: 'media/chapters/grab-06.jpg' },
    ],
    stills: [],
  },
  {
    slug: 'google-gemini',
    name: 'Google Gemini',
    client: 'Google',
    discipline: 'SaaS explainer',
    year: 2026,
    length: '0:22',
    film: {
      src: 'media/films/gemini.mp4',
      poster: 'media/films/gemini-poster.jpg',
      start: 2.8,
      loop: 'media/films/gemini-loop.mp4',
    },
    summary: 'Making the most advanced AI in the world feel approachable, intuitive and inevitable.',
    description: [
      'A SaaS explainer for Google Gemini, built to communicate the breadth of an AI platform without losing a single viewer in the complexity. The brief was simple: make the world’s most advanced AI feel approachable, intuitive and inevitable.',
      'Every motion decision was guided by one question: does this make it clearer? The result is a clean, forward-moving piece that earns its runtime.',
    ],
    process: 'The visual language strips back to essentials: light, type and purposeful motion. No decorative elements. Everything on screen earns its place by carrying information forward.',
    tools: 'Motion design in After Effects. Type animation and layout in Illustrator. Final edit and colour grade in Premiere Pro.',
    chapters: [
      { t: 2.8, label: 'What should we focus on?', thumb: 'media/chapters/gemini-01.jpg' },
      { t: 4.7, label: 'Choosing a model', thumb: 'media/chapters/gemini-02.jpg' },
      { t: 12.3, label: 'The answer', thumb: 'media/chapters/gemini-03.jpg' },
      { t: 14.2, label: 'On a laptop', thumb: 'media/chapters/gemini-04.jpg' },
      { t: 16.1, label: 'Any time, anywhere', thumb: 'media/chapters/gemini-05.jpg' },
    ],
    stills: [
      { src: 'media/process/gemini-premiere.jpg', alt: 'Premiere Pro timeline for the Gemini film, with six audio tracks under one video track', caption: 'The edit in Premiere Pro. Six tracks of ambience, shimmer and interface clicks under 22 seconds of picture.' },
    ],
  },
  {
    slug: 'social-ui-animation',
    name: 'Social UI Animation',
    client: 'Alice Lugendo',
    discipline: 'Live motion',
    year: 2026,
    length: '0:50',
    film: {
      src: 'media/films/ig.mp4',
      poster: 'media/films/ig-poster.jpg',
      start: 6.2,
      loop: 'media/films/ig-loop.mp4',
    },
    summary: 'Instagram-native and scroll-stopping, somewhere between a product demo and an art piece.',
    description: [
      'A UI animation piece built for social: Instagram-native, scroll-stopping, and designed to hold attention past the first half-second. The constraint was the format; the challenge was making it feel limitless.',
      'Live motion overlays merged with interface elements to create something that sits between a product demo and an art piece.',
    ],
    process: 'Interface mockups built in Figma, brought to life in After Effects. The live-motion layer was composited and graded in Premiere Pro to keep the blend tonally tight.',
    tools: 'Figma, After Effects, Premiere Pro.',
    chapters: [
      { t: 6.2, label: 'Instagram profile', thumb: 'media/chapters/ig-01.jpg' },
      { t: 10.4, label: 'TikTok', thumb: 'media/chapters/ig-02.jpg' },
      { t: 14.6, label: 'The feed', thumb: 'media/chapters/ig-03.jpg' },
      { t: 22.9, label: 'YouTube', thumb: 'media/chapters/ig-04.jpg' },
      { t: 35.4, label: 'Latest video', thumb: 'media/chapters/ig-05.jpg' },
      { t: 47.9, label: 'Sign-off', thumb: 'media/chapters/ig-06.jpg' },
    ],
    stills: [
      { src: 'media/process/social-ui-after-effects.jpg', alt: 'After Effects composition with more than 340 layers', caption: 'The main comp in After Effects. Over 340 layers, most of them nulls and text.' },
      { src: 'media/process/social-ui-premiere.jpg', alt: 'Premiere Pro timeline with the vertical cut and sound design', caption: 'The vertical cut in Premiere Pro, with the button and select sounds laid in by hand.' },
    ],
  },

  // ---- In the edit: no film yet ----
  {
    slug: 'pinterest',
    name: 'Pinterest',
    client: 'Pinterest',
    discipline: 'App animation',
    year: 2026,
    length: null,
    film: null,
    summary: 'The app feeling alive in someone’s hands.',
    description: [
      'An app animation for Pinterest, designed to show the product feeling alive in someone’s hands. Micro-interactions and scroll behaviours that make the app feel inevitable to pick up.',
      'The challenge was representing a discovery-driven platform with motion that mirrors that feeling: curious, layered, satisfying.',
    ],
    process: 'Prototyped in Figma, then rebuilt in After Effects for full motion control. Easing curves were tuned by hand for every interaction to match the platform’s tactile feel.',
    tools: 'Figma for UI, After Effects for animation, Premiere Pro for assembly and grading.',
    chapters: [],
    stills: [],
  },
  {
    slug: 'midrar-logo',
    name: 'Midrar',
    client: 'Midrar',
    discipline: 'Logo animation',
    year: 2026,
    length: null,
    film: null,
    summary: 'The three seconds where a brand earns trust or loses it.',
    description: [
      'A logo animation for Midrar: the three-second moment a brand either earns or loses trust. The brief was a reveal that felt inevitable, not decorative.',
      'The mark needed to arrive with weight. The solution was to build the animation from the inside out, letting the geometry construct itself before the full identity locks into place.',
    ],
    process: 'Pure After Effects. Every path animated by hand. Sound design composed to match the reveal, so the audio and the picture hit the same moment.',
    tools: 'After Effects, Adobe Audition for sound. Final mix in Premiere Pro.',
    chapters: [],
    stills: [],
  },
  {
    slug: 'tina-and-co',
    name: 'Tina and Co',
    client: 'Tina and Co',
    discipline: 'Live motion graphics',
    year: 2026,
    length: null,
    film: null,
    summary: 'Lower thirds, transitions and kinetic text that feel native to the frame.',
    description: [
      'Live motion graphics for Tina and Co, overlaid to lift raw footage into a finished, broadcast-grade production. Lower thirds, transitions and kinetic text that feel native to the frame rather than pasted on top.',
      'The work needed tight sync between the motion layer and the live edit, with no room for elements that called attention to themselves.',
    ],
    process: 'Motion templates built in After Effects and rendered with alpha channels. Final integration and colour matching in Premiere Pro to keep the motion layer consistent with the footage.',
    tools: 'After Effects, Premiere Pro.',
    chapters: [],
    stills: [],
  },
  {
    slug: 'mercedes-edit',
    name: 'Mercedes Edit',
    client: 'Mercedes-Benz',
    discipline: 'VFX and speed ramp',
    year: 2026,
    length: null,
    film: null,
    summary: 'Making a car feel like a decision. Every frame a reason.',
    description: [
      'A VFX and speed-ramp edit for Mercedes, the kind of piece where timing is everything. Each cut lands on a beat, each ramp stretches and compresses time to make the machine feel alive.',
      'The goal was to make a car feel like a decision. Every frame a reason.',
    ],
    process: 'Speed ramping done frame by frame in Premiere Pro, with VFX compositing in After Effects. The grade pushes contrast and tone into premium territory.',
    tools: 'Premiere Pro, After Effects.',
    chapters: [],
    stills: [],
  },
  {
    slug: 'bmw-edit',
    name: 'BMW Edit',
    client: 'BMW',
    discipline: 'VFX and speed ramp',
    year: 2026,
    length: null,
    film: null,
    summary: 'Precision cutting that mirrors the engineering of the car.',
    description: [
      'A speed-ramp edit for BMW: precision cutting that mirrors the engineering precision of the car itself. Fast where the footage demands it, slow where it rewards.',
      'Clean VFX keeps the viewer inside the world of the car rather than the edit.',
    ],
    process: 'Frame-precise speed changes in Premiere Pro. VFX and sky replacement composited in After Effects. Final grade in Premiere Pro.',
    tools: 'Premiere Pro, After Effects.',
    chapters: [],
    stills: [],
  },
  {
    slug: 'mrt-edit',
    name: 'MRT Edit',
    client: 'MRT Malaysia',
    discipline: 'VFX and speed ramp',
    year: 2026,
    length: null,
    film: null,
    summary: 'Infrastructure reframed as cinema.',
    description: [
      'A VFX and speed-ramp edit for Malaysia’s MRT: infrastructure reframed as cinematic subject matter. Urban motion cut to rhythm, with effects that give scale to something most people pass through without looking.',
      'The brief was to make the mundane feel significant. The answer was in the pacing.',
    ],
    process: 'Location footage graded in Premiere Pro. Speed ramps built frame by frame. Motion overlays and VFX composited in After Effects.',
    tools: 'Premiere Pro, After Effects.',
    chapters: [],
    stills: [],
  },
]

export const findProject = slug => projects.find(p => p.slug === slug)

// Media object for a project's film, ready for <Media />.
export const filmOf = p => (p?.film ? { type: 'video', ...p.film } : null)
