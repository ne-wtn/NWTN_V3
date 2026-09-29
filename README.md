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
| Work: films, their categories and lines, the Grab case study | `src/content/projects.js` |
| About page | `src/content/about.js` |
| Contact letter, dropdown options, brief rows, messages, the Tally intake link | `src/content/contact.js` |
| The two emails sent for each brief | `emails/brief.js` |
| Privacy and Terms | `src/content/legal.js` |
| Work page and 404 copy | `src/content/pages.js` |
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

`start` skips slow fade-ins when a film autoplays.

### The Work page

Work is shown one category at a time: motion design at `/projects`, video editing at `/projects/editing`. The page title is the switch between them: the category you're on in ink, the other a blue link. Switching only moves the films (they slide across in the direction of the switch, in `src/pages/Projects.jsx`); the title, nav and footer stay put. Each film in `projects.js` has a `category` (`motion` or `edit`), a `shape` (`wide`, `square` or `tall` for the phone edits) and a one-line `summary`. Films marked `lead: true` come first: side by side for motion design, with the rest in a row under them; video editing shows three portrait films to a row. A film with a `caseStudy` (only Grab for now) has its own page; the others open full size in a player, with sound.

To add a film, make its three files (full film, silent preview loop, still) with:

```
python tools/film.py "path/to/export.mp4" my-film --shape tall --preview 3
```

then copy an entry in `projects.js` and point it at `media/films/my-film…`. Keep each file under 25 MB (Cloudflare's limit); the tool's settings do that for films up to about a minute.

### Adding a band to the home page

Copy an entry in `home.js` → `bands`. `tone` is `sky`, `sand`, `deep`, `mist` or `white`. `layout` is `split`, `split-reverse` or `wide`.

### Ribbons

On the home page, smooth ribbons draw themselves in behind some sections as you scroll. They stay fixed in place; ribbons you've already scrolled past are simply shown drawn, so nothing lags behind. Each one is a named route in `src/lib/ribbons.js` (with a desktop and a phone version), switched on in the content files:

| Where | Setting |
|---|---|
| Home bands | `home.js` → a band's `ribbon` (e.g. `'weave'`) |
| Home closing section | `home.js` → `close.ribbon` |

The Sonic Vision band has a playing sound wave above its paragraph instead (`soundwave` in `home.js`; the look is in `src/lib/soundwave.js`).

To make it move exactly like a real song (no audio is kept or played, only its levels):

```
python tools/levels.py path/to/song.mp3 public/media/levels/song.lvl
```

then set `soundwave: { levels: 'media/levels/song.lvl', start: 0 }` (`start` shifts where the song begins, in seconds). The song runs from the moment the site loads, so the bars show wherever it has got to when a visitor scrolls down, and it loops. `soundwave: true` uses a built-in rhythm instead. The tool needs Python with numpy and ffmpeg (see the top of `tools/levels.py`).

Delete a setting to turn that ribbon off. On dark sections the colours switch to a darker set automatically so white text stays readable. Anchors ending in a selector (like `['.btn', 0.12, 0.5]`) make a ribbon finish exactly on that element.

### Page changes

Moving between pages, the old page fades away and the new one rises into place while the nav stays put (the browser's view transitions, switched on by `viewTransition` on each internal link). Back and Forward animate the same way and return you to where you were on the page. The timings are the `page-out` and `page-in` lines in `src/styles/base.css`. Browsers without view transitions, and visitors who ask for reduced motion, get an instant change. New internal links should use `SmartLink` or add `viewTransition` to their `<Link>`.

### The opening

When someone first opens the site (on any page), it stays plain white for a moment while the fonts and the images on the first screen arrive, then the nav fades in and the page rises into place, so nothing pops in or changes font in front of them. It never waits more than 2 seconds; on a slow connection the page comes in on time and anything still missing fills in afterwards. The logic is in `src/lib/opening.js` (the time limit is `LIMIT`), the look is the `open-nav` and `open-page` lines in `src/styles/base.css`. A custom intro animation would play during this wait; `startOpening` in `opening.js` is where it hooks in.

The 3D models in the headline start downloading straight away but are only set up once the page has come in, so they never hold it up. Then they fade in and grow into place one after another, swinging round to face you (`.inline-model` in `src/styles/pages.css`, and the starting turn in `src/lib/model3d.js`).

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
- *Email Templates*: two templates, one per email (the designs themselves come from `emails/brief.js`). Set both up the same way:

  | Setting | Your copy ("Brief to Newton") | The client's copy ("Brief to client") |
  |---|---|---|
  | Subject | `{{subject}}` | `{{subject}}` |
  | Content | code editor, replace everything with `{{{html}}}` (three braces) | the same |
  | To Email | `{{to_email}}` (or nfxmotion@gmail.com) | `{{to_email}}`, **never your own address** |
  | From Name | `{{sender_name}}` | `{{sender_name}}` |
  | From Email | keep "Use default email address" ticked | the same |
  | Reply To | `{{reply_to}}` | `{{reply_to}}` |

  Note both **Template IDs**. (The old site's two templates also work as they are: every answer is sent under the names they use, `from_name`, `from_email`, `company`, `goal` and so on, plus `intake_url` for the Tally link. They'd show their own old text instead of these designs.)
- *Account → API keys*: note the **Public key** and **Private key**.
- *Account → Security*: turn on **Allow EmailJS API for non-browser applications** (the sending happens on the server).
- EmailJS takes one request a second, so the client's copy goes out about a second after yours (handled in `server/mail.js`).
- **If a client doesn't get their copy:** open *Email History* in EmailJS. Their email should be listed with their address as the recipient. If it went to you, the client template's To Email isn't `{{to_email}}`; if it isn't listed, check `EMAILJS_REPLY_TEMPLATE_ID`. After a test brief, the form's reply (browser DevTools → Network → `brief`) also says `"copy": "sent"` or `"failed"`.

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
| `EMAILJS_NOTIFY_TEMPLATE_ID` | your copy's template, from step 1 | Secret |
| `EMAILJS_REPLY_TEMPLATE_ID` | the client's template, from step 1 | Secret |
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
