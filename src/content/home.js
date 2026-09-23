// Home page copy and media.
//
// Media objects look like:
//   { type: 'image', src: 'media/…jpg', alt: '…' }
//   { type: 'video', src: 'media/…mp4', poster: 'media/…jpg', start: 2.8 }
// Set media to null to show a placeholder frame instead.

export const home = {
  hero: {
    // Text and small inline media, in reading order.
    headline: [
      'I make ',
      { type: 'video', src: 'media/chips/motion.mp4', label: 'A moment from the Grab film' },
      ' motion, ',
      { type: 'image', src: 'media/chips/stories.jpg', label: 'A storyboard frame' },
      ' stories & ',
      { type: 'image', src: 'media/chips/sound.jpg', label: 'Audio waveforms on a timeline' },
      ' sound that matters.',
    ],
    intro: 'I’m Newton, a motion designer and video editor in Kuala Lumpur. I help SaaS brands turn complex features into short, cinematic films.',
    cta: { label: 'See the work', to: '/projects' },
    // Which project's film plays under the headline.
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
      label: 'Storytelling',
      title: 'Every film starts as a storyboard.',
      body: 'Before anything moves, I map the story frame by frame. This is the board for my own intro: sixteen frames, one idea each.',
      cta: { label: 'How I work', to: '/about' },
      media: { type: 'image', src: 'media/process/storyboard.jpg', alt: 'Sixteen-frame storyboard in Figma for the Newtn intro film' },
      caption: 'The storyboard for my intro, in Figma.',
    },
    {
      tone: 'deep',
      layout: 'wide',
      label: 'Sonic Vision',
      title: 'You should be able to watch it with your eyes closed.',
      body: 'Sound isn’t something I add at the end. Under the 22 seconds of the Gemini film sit six tracks of ambience, shimmer and interface clicks, each cut to the frame.',
      media: { type: 'image', src: 'media/process/gemini-premiere.jpg', alt: 'Premiere Pro timeline for the Gemini film with six audio tracks' },
      caption: 'The Gemini edit in Premiere Pro. Picture on top, sound underneath.',
    },
    {
      tone: 'sand',
      layout: 'split-reverse',
      label: 'Tech = Motion',
      title: 'Built by hand, frame by frame.',
      body: 'No template packs doing the heavy lifting. I build every frame myself, so I act as your creative director and motion lead at once.',
      cta: { label: 'Services', to: '/about#services' },
      media: { type: 'image', src: 'media/process/social-ui-after-effects.jpg', alt: 'After Effects composition with over 340 layers' },
      caption: 'One comp from the Instagram piece. Over 340 layers.',
    },
  ],

  work: {
    title: 'Selected work',
    slugs: ['grab-malaysia', 'google-gemini', 'social-ui-animation'],
    link: { label: 'All projects', to: '/projects' },
  },

  close: {
    title: 'You’ll work with me, not an agency.',
    // {spots} and {month} are filled in from site.js
    body: 'No account managers, no hand-offs. I only take a few projects a month so each one gets my full attention. Right now I have {spots} spots open for {month}.',
    cta: { label: 'Check availability', to: '/contact' },
  },
}
