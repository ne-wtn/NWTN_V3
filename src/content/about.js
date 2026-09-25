// About page copy and media.

export const about = {
  label: 'About',
  title: 'My brand was built on a single obsession.',
  intro: 'What started with a laptop and pure will has grown into a full-pipeline studio for visual storytelling and animation. No shortcuts, no luck.',
  media: { type: 'image', src: 'media/process/storyboard.jpg', width: 1600, height: 900, alt: 'Sixteen-frame storyboard in Figma' },
  caption: 'Where every project starts: the storyboard.',

  // `id` makes each section linkable, e.g. /about#services
  sections: [
    {
      id: 'values',
      title: 'My values',
      paras: [
        '“Problem solving” is the core value that governs how I create, paired with creativity, as I try to make visuals that carry the message with the utmost thoughtfulness.',
        'I dwell on the principles of preciseness, minimalism and clean visuals. Motion is about creating an emotional connection, simplifying the complex, and leaving a lasting impression.',
      ],
    },
    {
      id: 'strategy',
      title: 'Strategy',
      paras: [
        'Total immersion. I don’t believe in divided attention or compromised quality. My process is built on singular focus.',
        'That means I only take 1–2 projects at a time, dedicating every resource to your aesthetic, vision and timeline, without distraction.',
      ],
    },
    {
      id: 'services',
      title: 'Services',
      list: ['SaaS explainer videos', 'App and software launches', 'UI/UX, app and website animation', 'Branding and motion identity', 'Sound design'],
      paras: [
        'Full pipeline: concept, motion, 3D and sound. No hand-offs, no middlemen. Just the work, you and an expert.',
      ],
    },
    {
      id: 'the-deal',
      title: 'The deal',
      paras: [
        'Every project is a 1:1 collaboration. No account managers, no hand-offs. You work directly with the person who makes your work, which means faster decisions, tighter feedback loops, and results that actually match your vision.',
        'Four years of high-end production have proven one thing: limitations don’t exist. There is always a way to make it work if you have the discipline to find it.',
      ],
    },
  ],

  tools: {
    title: 'Tools',
    items: ['After Effects', 'Premiere Pro', 'Illustrator', 'Figma', 'Audition'],
  },

  close: {
    title: 'Like the sound of this?',
    body: 'Booking {perMonth} projects a month. Tell me about yours and I’ll reply within {replyTime}.',
    cta: { label: 'Start a project', to: '/contact' },
  },
}
