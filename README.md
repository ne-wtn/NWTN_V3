# newtnfx.com

Newton Diodory's portfolio. React + Vite, deployed on Cloudflare Pages.

```
npm install
npm run dev          # http://localhost:4321 (contact form in preview mode)
npm run build        # production build in dist/
npm run preview:cf   # http://localhost:8788, the built site plus the form's server function
```

## Changing things

Almost every change is one edit in `src/content/` or one file in `public/media/`.

| To change… | Edit |
|---|---|
| Email, phone, socials, footer links | `src/content/site.js` |
| Spots open this month | `site.js` → `availability.spots` |
| Home headline, bands, selected work | `src/content/home.js` |
| A project's text, film, chapters, stills | `src/content/projects.js` |
| About page | `src/content/about.js` |
| Contact letter, dropdown options, brief rows, messages | `src/content/contact.js` |
| The two emails sent for each brief | `emails/brief.js` |
| Privacy and Terms | `src/content/legal.js` |
| Projects page and 404 copy | `src/content/pages.js` |
| Colours, fonts, sizes | `src/styles/tokens.css` |

### Swapping media

1. Put the file in `public/media/` (films in `films/`, working files in `process/`, etc.).
2. Point to it in the content file, without a leading slash: `src: 'media/films/new-film.mp4'`.

A media value is one of:

```js
{ type: 'video', src: 'media/films/x.mp4', poster: 'media/films/x-poster.jpg', start: 2.5 }
{ type: 'image', src: 'media/process/x.jpg', alt: 'What the image shows' }
null   // shows a crossed placeholder frame until the real thing is ready
```

A project with `film: null` shows "In the edit" everywhere. Once its film exists, add the `film` object and it moves to the main grid by itself. Hide unfinished projects entirely with `showUnreleased: false` in `site.js`.

Keep films web-sized: 1280px wide, H.264, around 1–6 MB. `start` skips slow fade-ins when a film autoplays.

### Adding a band to the home page

Copy an entry in `home.js` → `bands`. `tone` is `sky`, `sand`, `deep`, `mist` or `white`. `layout` is `split`, `split-reverse` or `wide`.

### The contact form

The brief is a letter with blanks. As it's filled in, the "Your brief" card beside it fills in too. Holding "Your brief" clears everything (with Undo).

- `contact.js` → `letter`: the wording, paragraph by paragraph. `{ field: 'name' }` drops in a blank.
- `fields`: every blank. `label` is how error messages name it.
- `options`: answers for the choice blanks. `phrase` reads in the letter, `short` in the brief, `value` is what gets emailed.
- `nodes`: the rows of "Your brief" and which blanks feed each.

The same rules check the answers in the browser and on the server (`src/contact/briefData.js`).

## Contact form: sending

```
browser ──POST──▶ /api/brief (functions/api/brief.js, runs on Cloudflare)
                   1. spam trap + Turnstile bot check
                   2. checks every answer again
                   3. builds both emails (emails/brief.js)
                   4. sends them (server/mail.js)
                        → Newton: "New brief: …", reply-to the client
                        → client: "Got your brief, …", reply-to Newton
```

`MAIL_PROVIDER` picks how emails go out: `emailjs` (through the Gmail account connected in EmailJS, so both come from nfxmotion@gmail.com), `resend` (from an address on your own domain), or `log` (prints them instead, for testing).

### One-time setup

**1. EmailJS** (emailjs.com)
- *Email Services*: connect the Gmail account nfxmotion@gmail.com. Note the **Service ID**.
- *Email Templates* → create one template, used for both emails:
  - Subject: `{{subject}}`
  - Content: open the code editor and replace everything with `{{{html}}}` (three braces)
  - To Email: `{{to_email}}`
  - From Name: `{{from_name}}`, and keep "Use default email address" ticked
  - Reply To: `{{reply_to}}`
  - Note the **Template ID**.
- *Account → API keys*: note the **Public key** and **Private key**.
- *Account → Security*: turn on **Allow EmailJS API for non-browser applications** (the sending happens on the server).

**2. Turnstile** (Cloudflare dashboard → Turnstile → Add widget)
- Hostname `newtnfx.com`, widget mode *Managed*. Note the **Site key** and **Secret key**.

**3. Cloudflare Pages project** (Settings)
- Build: framework preset *None*, build command `npm run build`, output directory `dist`, root directory left empty. (`.node-version` asks for Node 22.)
- *Variables and secrets*:

| Name | Value | Type |
|---|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key | Plain text |
| `MAIL_PROVIDER` | `emailjs` | Plain text |
| `NOTIFY_TO` | `nfxmotion@gmail.com` | Plain text |
| `TURNSTILE_SECRET` | Turnstile secret key | Secret |
| `EMAILJS_SERVICE_ID` | from step 1 | Secret |
| `EMAILJS_TEMPLATE_ID` | from step 1 | Secret |
| `EMAILJS_PUBLIC_KEY` | from step 1 | Secret |
| `EMAILJS_PRIVATE_KEY` | from step 1 | Secret |

Redeploy after adding them.

### Testing locally

```
cp .dev.vars.example .dev.vars    # local secrets, never committed
npm run preview:cf                # http://localhost:8788
```

With `MAIL_PROVIDER=log` the emails are printed in the terminal instead of sent. Put the EmailJS values in `.dev.vars` and set `MAIL_PROVIDER=emailjs` to send real ones. The Turnstile secret in the example is Cloudflare's always-pass test key; to use it, build with the matching test site key: `VITE_TURNSTILE_SITE_KEY=1x00000000000000000000BB npm run preview:cf`.

### Email designs

Edit `emails/brief.js`, then run `node emails/preview.mjs` and open `emails/preview/index.html` to see both emails at desktop and phone size.

## Shareable preview

`npm run build:artifact` makes a copy with `#/` links and relative paths, for the private preview link.
