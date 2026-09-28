// Site-wide details: who, where, how to reach you, availability.
// Change a value here and it updates everywhere it is shown.

export const site = {
  name: 'NWTN',
  wordmark: 'newtn',
  person: 'Newton Diodory',
  discipline: 'Motion design and video editing',
  location: 'Kuala Lumpur, Malaysia',
  domain: 'https://newtnfx.com',

  email: 'nfxmotion@gmail.com',
  phone: '+60 11-2846 0590',
  whatsapp: 'https://wa.me/601128460590',
  instagram: { handle: '@ne.wtn', url: 'https://www.instagram.com/ne.wtn/' },
  linkedin: 'https://www.linkedin.com/in/newton-diodory-7b45a9244/',

  // Edit by hand each month. The month name fills itself in.
  availability: {
    spots: 2,
    perMonth: '1–4',
  },
  replyTime: '24 hours',

  nav: [
    { label: 'Work', to: '/projects' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],

  // One line above the footer, per page. Pages not listed get none.
  // A key ending in "/" also matches every page under it.
  taglines: {
    '/projects': { text: 'Want to be next?', link: { label: 'Start a project', to: '/contact' } },
    '/projects/editing': { text: 'Want to be next?', link: { label: 'Start a project', to: '/contact' } },
    '/projects/': { text: 'Want something like this?', link: { label: 'Let’s talk', to: '/contact' } },
  },

  footer: {
    columns: [
      { title: 'Work', links: [
        { label: 'Motion design', to: '/projects' },
        { label: 'Video editing', to: '/projects/editing' },
        { label: 'Grab case study', to: '/projects/grab-malaysia' },
      ] },
      { title: 'Studio', links: [
        { label: 'About', to: '/about' },
        { label: 'Services', to: '/about#services' },
        { label: 'The deal', to: '/about#the-deal' },
      ] },
      { title: 'Contact', links: [
        { label: 'Start a project', to: '/contact' },
        { label: 'WhatsApp', href: 'https://wa.me/601128460590' },
        { label: 'nfxmotion@gmail.com', href: 'mailto:nfxmotion@gmail.com' },
      ] },
      { title: 'Social', links: [
        { label: 'Instagram', href: 'https://www.instagram.com/ne.wtn/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/newton-diodory-7b45a9244/' },
      ] },
      { title: 'Legal', links: [
        { label: 'Privacy', to: '/privacy' },
        { label: 'Terms', to: '/terms' },
      ] },
    ],
    copyright: '© 2026 Newton Diodory',
    rights: 'All rights reserved',
  },
}
