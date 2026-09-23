// Contact page: a fill-in-the-blanks letter on the left, and "Your brief"
// on the right, which fills in as the letter is written.
//
// letter:  the brief, paragraph by paragraph. Plain strings are text;
//          { field: 'name' } drops in a blank. Reword freely, but keep every
//          required field somewhere in it.
// fields:  every blank. `label` is how error messages refer to it.
// options: answers for the choice blanks. `phrase` is how it reads in the
//          letter, `short` is how it reads in the brief, `value` is what gets emailed.
// nodes:   the rows of "Your brief" and which blanks feed each one.

export const contact = {
  label: 'Contact',
  title: 'Tell me about your project.',
  intro: [
    'I help category-leading SaaS brands turn complex features into cinematic visual stories.',
    'Fill in the blanks below. It takes about two minutes, and I’ll reply within {replyTime}.',
  ],

  letter: [
    ['Hi Newton, my name is ', { field: 'name' }, ' and I work at ', { field: 'company' }, '.'],
    ['You can find us at ', { field: 'website' }, '.'],
    [
      'We’re looking for ', { field: 'goal' },
      '. Right now we have ', { field: 'state' },
      ', our budget is ', { field: 'budget' },
      ' and we’d love to have it by ', { field: 'deadline' }, '.',
    ],
    ['A bit more about it:', { field: 'message' }],
    ['You can reach me at ', { field: 'email' }, ' or on ', { field: 'phone' }, '.'],
  ],

  fields: {
    name: { label: 'your name', type: 'text', placeholder: 'your name', required: true, autoComplete: 'name' },
    company: { label: 'company name', type: 'text', placeholder: 'company name', required: true, autoComplete: 'organization' },
    website: { label: 'company website', type: 'url', placeholder: 'yourbrand.com (optional)', required: false, autoComplete: 'url' },
    goal: { label: 'what you’re looking for', type: 'choice', options: 'goals', placeholder: 'pick a kind of film', required: true },
    state: { label: 'where the project is now', type: 'choice', options: 'states', placeholder: 'pick a stage', required: true },
    budget: { label: 'budget', type: 'choice', options: 'budgets', placeholder: 'pick a range', required: true },
    deadline: { label: 'deadline', type: 'text', placeholder: 'a date or turnaround', required: true },
    message: { label: 'project notes', type: 'textarea', placeholder: 'The product, who it’s for, links to films you love… don’t hold back.', required: false },
    email: { label: 'work email', type: 'email', placeholder: 'work email', required: true, autoComplete: 'email' },
    phone: { label: 'phone number', type: 'tel', placeholder: '+60 12 345 6789', required: true, autoComplete: 'tel' },
  },

  options: {
    goals: [
      { value: 'Product Explainer', phrase: 'a product explainer', short: 'Product explainer' },
      { value: 'Brand Film', phrase: 'a brand film', short: 'Brand film' },
      { value: 'Launch Video', phrase: 'a launch video', short: 'Launch video' },
      { value: 'Motion Identity', phrase: 'a motion identity', short: 'Motion identity' },
      { value: 'Sonic Design', phrase: 'sonic design', short: 'Sonic design' },
    ],
    states: [
      { value: 'Just an idea', phrase: 'just an idea', short: 'Just an idea' },
      { value: 'Rough concept', phrase: 'a rough concept', short: 'Rough concept' },
      { value: 'Script ready', phrase: 'a finished script', short: 'Script ready' },
      { value: 'Full storyboard ready', phrase: 'a full storyboard', short: 'Storyboard ready' },
    ],
    budgets: [
      { value: '$500 – $1k', phrase: '$500 to $1k', short: '$500–1k' },
      { value: '$1k – $2.5k', phrase: '$1k to $2.5k', short: '$1k–2.5k' },
      { value: '$2.5k – $5k', phrase: '$2.5k to $5k', short: '$2.5k–5k' },
      { value: '$5k+', phrase: 'over $5k', short: '$5k+' },
      { value: 'Prefer not to say', phrase: 'something I’d rather discuss', short: 'Let’s discuss' },
    ],
  },

  nodes: [
    { id: 'you', short: 'From', fields: ['name', 'company', 'website'] },
    { id: 'film', short: 'Making', fields: ['goal'] },
    { id: 'stage', short: 'Stage', fields: ['state'] },
    { id: 'budget', short: 'Budget', fields: ['budget'] },
    { id: 'timing', short: 'Due', fields: ['deadline'] },
    { id: 'notes', short: 'Notes', fields: ['message'] },
    { id: 'email', short: 'Email', fields: ['email'] },
    { id: 'phone', short: 'Phone', fields: ['phone'] },
  ],

  brief: {
    title: 'Your brief',
    received: 'Received',
  },

  // Press and hold "Your brief" to clear everything, last answer first.
  rewind: {
    hint: 'Hold to rewind',
    cleared: 'Brief cleared.',
    undo: 'Undo',
  },

  consent: {
    text: 'I agree to my details being used to reply to this brief, as set out in the',
    privacy: 'Privacy Policy',
    and: 'and',
    terms: 'Terms of Service',
  },
  missing: 'A few blanks are still empty:',
  invalid: {
    email: 'That email doesn’t look quite right.',
    website: 'That website doesn’t look quite right.',
    consent: 'Tick the box so I can reply to you.',
  },
  submit: 'Check availability',
  sending: 'Sending',
  instagram: 'Also have a look at my previous work on',

  error: {
    title: 'Something went wrong.',
    body: 'The brief didn’t go through. Please try again. If it keeps happening, email me directly at nfxmotion@gmail.com',
    retry: 'Try again',
  },

  sent: {
    title: 'Oh it’s onnn!',
    tagline: 'one of the best decisions you’ve done.',
    body: 'I’m on it. Expect a reply within {replyTime}, stg. Matter of fact, a confirmation just dropped in your inbox 📬',
    note: 'In the meantime, go touch some grass. No actually, just look at more of what I do.',
    cta: { label: 'View selected work', to: '/projects' },
    again: 'Start a new brief',
  },
}
