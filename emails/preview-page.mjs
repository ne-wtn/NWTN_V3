// Builds a one-page preview of both brief emails, with a made-up brief, that can be opened
// anywhere (the logo is embedded, nothing loads from newtnfx.com):
//   node emails/preview-page.mjs   →   ../directions/emails/index.html
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { notifyEmail, replyEmail } from './brief.js'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '..', '..', 'directions', 'emails', 'index.html')

const values = {
  name: 'Aisha Rahman', company: 'Loopline', website: 'loopline.io', goal: 'Launch Video', state: 'Script ready',
  budget: '$2.5k – $5k', deadline: 'End of November', email: 'aisha@loopline.io', phone: '+60 12 345 6789',
  message: 'A 30-second launch film for our new scheduling app. We love clean UI animation with a bit of sound design.',
}
const mark = 'data:image/png;base64,' + readFileSync(join(here, '..', 'public', 'media', 'email', 'mark-blue.png')).toString('base64')
const embed = html => html.replaceAll('https://newtnfx.com/media/email/mark-blue.png', mark)
const client = replyEmail(values)
const newton = notifyEmail(values, { at: new Date('2026-09-29T14:20:00+08:00') })
const mails = {
  client: { subject: client.subject, meta: 'From: Newton Diodory (nfxmotion@gmail.com) · To: aisha@loopline.io', html: embed(client.html) },
  newton: { subject: newton.subject, meta: 'From: Newtn brief form (nfxmotion@gmail.com) · To: nfxmotion@gmail.com · Reply-to: aisha@loopline.io', html: embed(newton.html) },
}

const page = `<title>Brief Emails</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root { --ink: #0E0F11; --grey: #5E636B; --rule: #D9DCE0; --paper: #FFFFFF; --ground: #EEF3F8; --blue: #004B87; color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--ground); color: var(--ink); font-family: 'Inter Tight', system-ui, -apple-system, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.5; padding-inline: clamp(16px, 3vw, 40px); padding-block: clamp(28px, 5vw, 52px) 64px; }
  .page { max-width: 1320px; margin: 0 auto; display: grid; gap: 22px; }
  h1 { margin: 0; font-size: clamp(32px, 4.4vw, 56px); font-weight: 500; letter-spacing: -0.045em; line-height: 1; }
  .lede { margin: 12px 0 0; max-width: 70ch; color: var(--grey); font-size: 16px; }
  .controls { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; }
  .seg { display: inline-flex; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; background: var(--paper); }
  .seg button { border: 0; background: none; padding: 7px 12px; font: inherit; font-size: 14px; color: var(--grey); cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--rule); }
  .seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
  .mail { background: var(--paper); border: 1px solid var(--rule); border-radius: 10px; overflow: hidden; }
  .head { padding: 16px 20px; border-bottom: 1px solid var(--rule); display: grid; gap: 2px; font-size: 14px; }
  .head b { font-size: 17px; letter-spacing: -0.01em; }
  .head span { color: var(--grey); }
  .frame { display: flex; justify-content: center; background: #EEF3F8; overflow-x: auto; }
  iframe { display: block; border: 0; width: 100%; max-width: 100%; background: #EEF3F8; }
  .phone iframe { width: 390px; }
  :focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
</style>
<div class="page">
  <header>
    <h1>The brief emails</h1>
    <p class="lede">What gets sent when someone submits a brief, shown with a made-up example brief. The client’s email confirms the brief arrived and points them to your Tally intake form. Both use a smaller type scale than before.</p>
  </header>
  <div class="controls">
    <span class="seg" id="which"><button type="button" data-v="client" aria-pressed="true">To the client</button><button type="button" data-v="newton" aria-pressed="false">To you</button></span>
    <span class="seg" id="size"><button type="button" data-v="desk" aria-pressed="true">Desktop</button><button type="button" data-v="phone" aria-pressed="false">Phone</button></span>
  </div>
  <div class="mail">
    <div class="head"><b id="subject"></b><span id="meta"></span></div>
    <div class="frame" id="frame"><iframe id="view" title="Email preview"></iframe></div>
  </div>
</div>
<script>
  const MAILS = ${JSON.stringify(mails).replace(/</g, '\\u003c')}
  const state = { which: 'client', size: 'desk' }
  const view = document.getElementById('view')
  const fit = () => { try { view.style.height = view.contentDocument.documentElement.scrollHeight + 'px' } catch {} }
  function show() {
    const m = MAILS[state.which]
    document.getElementById('subject').textContent = m.subject
    document.getElementById('meta').textContent = m.meta
    document.getElementById('frame').classList.toggle('phone', state.size === 'phone')
    view.srcdoc = m.html
    document.querySelectorAll('.seg').forEach(seg => seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(state[seg.id] === b.dataset.v))))
  }
  view.addEventListener('load', () => { fit(); setTimeout(fit, 400); setTimeout(fit, 1200) })
  document.querySelectorAll('.seg').forEach(seg => seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; state[seg.id] = b.dataset.v; show() }))
  addEventListener('resize', fit)
  show()
</script>
`
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, page)
console.log(`Wrote ${out}`)
