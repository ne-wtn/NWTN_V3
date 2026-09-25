// Home page copy and media.
//
// Media objects look like:
//   { type: 'image', src: 'media/…jpg', alt: '…' }
//   { type: 'video', src: 'media/…mp4', poster: 'media/…jpg', start: 2.8 }
// Set media to null to show a placeholder frame instead.

export const home = {
  hero: {
    // Text and small media, in reading order. Each slot can be:
    //   { type: 'video', src: 'media/chips/….mp4' }   a short muted loop
    //   { type: 'image', src: 'media/chips/….jpg' }
    //   { type: 'model', src: 'media/models/….glb' }  looks at the cursor from its own spot
    // Model options: width (slot width in em), rotate ([x, y, z] resting angle in degrees),
    // crop (keep only this front share, 0–1), range (how far it turns, 1 = full),
    // scale (size within the slot, 1 = fills it).
    // `credit` records who made a model, for the attribution its licence asks for.
    headline: [
      'I make ',
      {
        type: 'model', src: 'media/models/cursor.glb', label: 'A 3D mouse cursor', width: 0.51, range: 0.6,
        rotate: [0, -31, 0], // the file rests turned ~31°; this squares it up to face you
        credit: { title: '3D Mouse Cursor', author: 'Ayal Othman', url: 'https://sketchfab.com/3d-models/3d-mouse-cursor-d1439485ea9c4b27945950d77b91cc72', license: 'CC BY 4.0' },
      },
      ' motion, ',
      {
        type: 'model', src: 'media/models/keycap.glb', label: 'A 3D keycap',
        width: 0.58, rotate: [90, 0, 0], crop: 0.33, range: 0.6, // just the top of the keycap, facing you
        credit: { title: 'Valorant Keycap', author: 'paololucas', url: 'https://sketchfab.com/3d-models/valorant-keycap-2738647111bf475e9aff2f518b30796b', license: 'CC BY 4.0' },
      },
      ' stories & ',
      {
        type: 'model', src: 'media/models/blueball.glb', label: 'A blue 3D basketball',
        width: 0.7, scale: 0.82, // a ball fills its whole frame, so it sits a little smaller to match the letters
        credit: { title: 'Basketball', author: 'psk98077', url: 'https://sketchfab.com/3d-models/basketball-dcbadafb788944d389609590334bdbd1', license: 'CC BY 4.0' },
      },
      ' sound that matters.',
    ],
    intro: 'I’m Newton, a motion designer and video editor in Kuala Lumpur. I help SaaS brands turn complex features into short, cinematic films.',
    cta: { label: 'See the work', to: '/projects' },
    // Which project's film fills the first screen, behind the headline.
    film: 'google-gemini',
    caption: 'SaaS explainer.',
  },

  clients: {
    lead: 'Films and edits for',
    names: ['Grab', 'Google Gemini', 'Pinterest', 'Mercedes', 'BMW', 'Malaysia’s MRT', 'Midrar', 'Tina & Co'],
  },

  // Coloured bands. tone: 'sky' | 'sand' | 'deep' | 'mist' | 'white'
  // layout: 'split' (text left), 'split-reverse' (media left), 'wide' (media below)
  bands: [
    {
      tone: 'sky',
      layout: 'split',
      ribbon: 'weave', // a ribbon that draws in behind the band as you scroll (routes in lib/ribbons.js; remove to turn off)
      label: 'Storytelling',
      title: 'Every film starts as a storyboard.',
      body: 'Before anything moves, I map the story frame by frame. This is the board for my own intro: sixteen frames, one idea each.',
      cta: { label: 'How I work', to: '/about' },
      media: { type: 'image', src: 'media/process/storyboard.jpg', width: 1600, height: 900, alt: 'Sixteen-frame storyboard in Figma for the Newtn intro film' },
      caption: 'The storyboard for my intro, in Figma.',
    },
    {
      tone: 'deep',
      // A sound wave above the paragraph. `levels` makes it move exactly like a real track
      // (made with tools/levels.py, no audio kept); `true` uses a built-in rhythm instead.
      soundwave: { levels: 'media/levels/clouds.lvl', start: 0 }, // "Clouds" by JVKE, running from site load; `start` shifts it (in seconds)
      layout: 'wide',
      label: 'Sonic Vision',
      title: 'You should be able to watch it with your eyes closed.',
      body: 'Sound isn’t something I add at the end. Under the 22 seconds of the Gemini film sit six tracks of ambience, shimmer and interface clicks, each cut to the frame.',
      media: { type: 'image', src: 'media/process/gemini-premiere.jpg', width: 1800, height: 962, alt: 'Premiere Pro timeline for the Gemini film with six audio tracks' },
      caption: 'The Gemini edit in Premiere Pro. Picture on top, sound underneath.',
    },
    {
      tone: 'sand',
      ribbon: 'motion-path',
      layout: 'split-reverse',
      label: 'Tech = Motion',
      title: 'Built by hand, frame by frame.',
      body: 'No template packs doing the heavy lifting. I build every frame myself, so I act as your creative director and motion lead at once.',
      cta: { label: 'Services', to: '/about#services' },
      media: { type: 'image', src: 'media/process/social-ui-after-effects.jpg', width: 1800, height: 977, alt: 'After Effects composition with over 340 layers' },
      caption: 'One comp from the Instagram piece. Over 340 layers.',
    },
  ],

  work: {
    title: 'Selected work',
    slugs: ['grab-malaysia', 'google-gemini', 'social-ui-animation'],
    link: { label: 'All projects', to: '/projects' },
  },

  close: {
    ribbon: 'to-button',
    title: 'You’ll work with me, not an agency.',
    // {spots} and {month} are filled in from site.js
    body: 'No account managers, no hand-offs. I only take a few projects a month so each one gets my full attention. Right now I have {spots} spots open for {month}.',
    cta: { label: 'Check availability', to: '/contact' },
  },
}
