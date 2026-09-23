// Builds preview pages for both brief emails with sample answers.
//   node emails/preview.mjs   →   open emails/preview/index.html
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { notifyEmail, replyEmail } from './brief.js'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, 'preview')
mkdirSync(out, { recursive: true })

const sample = {
  name: 'Aisha Rahman',
  company: 'Loop Labs',
  website: 'looplabs.io',
  goal: 'Launch Video',
  state: 'Script ready',
  budget: '$1k – $2.5k',
  deadline: 'end of November',
  message: 'A 45-second launch film for our new analytics dashboard, going out on the site and LinkedIn.\nReferences we love: Linear, Arc.',
  email: 'aisha@looplabs.io',
  phone: '+60 12 345 6789',
}
const at = new Date('2026-09-23T09:32:00Z')
const assets = '../../public/media' // local images for the preview; the live emails use https://newtnfx.com/media

const emails = [
  { file: 'notify', title: 'To you', to: 'nfxmotion@gmail.com', from: 'Newtn brief form', replyTo: 'aisha@looplabs.io', ...notifyEmail(sample, { at, assets }) },
  { file: 'reply', title: 'To the client', to: 'aisha@looplabs.io', from: 'Newton Diodory', replyTo: 'nfxmotion@gmail.com', ...replyEmail(sample, { assets }) },
]

for (const e of emails) {
  writeFileSync(join(out, `${e.file}.html`), e.html)
  writeFileSync(join(out, `${e.file}.txt`), e.text)
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const block = e => `
<section>
  <h2>${esc(e.title)}</h2>
  <dl>
    <div><dt>From</dt><dd>${esc(e.from)}</dd></div>
    <div><dt>To</dt><dd>${esc(e.to)}</dd></div>
    <div><dt>Reply-to</dt><dd>${esc(e.replyTo)}</dd></div>
    <div><dt>Subject</dt><dd><strong>${esc(e.subject)}</strong></dd></div>
    <div><dt>Preview line</dt><dd>${esc(e.preheader)}</dd></div>
  </dl>
  <div class="frames">
    <figure><iframe src="${e.file}.html" title="${esc(e.title)}, desktop" style="width:680px"></iframe><figcaption>Desktop</figcaption></figure>
    <figure><iframe src="${e.file}.html" title="${esc(e.title)}, phone" style="width:375px"></iframe><figcaption>Phone</figcaption></figure>
  </div>
</section>`

writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Brief Emails</title>
<style>
  body { margin: 0; padding: 40px 32px 80px; background: #F6F7F9; color: #0E0F11; font: 15px/1.5 system-ui, sans-serif; }
  h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: -0.02em; }
  body > p { margin: 0 0 40px; color: #5E636B; }
  section { margin-bottom: 64px; }
  h2 { margin: 0 0 12px; font-size: 19px; }
  dl { display: grid; gap: 4px; margin: 0 0 20px; font-size: 14px; }
  dl div { display: flex; gap: 12px; } dt { width: 96px; color: #5E636B; } dd { margin: 0; }
  .frames { display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap; }
  figure { margin: 0; } iframe { height: 1400px; border: 1px solid #D9DCE0; border-radius: 10px; background: #fff; }
  figcaption { margin-top: 8px; font-size: 13px; color: #5E636B; }
</style></head><body>
<h1>Brief emails</h1>
<p>Sample answers. Sender addresses are placeholders until the sending is wired up.</p>
${emails.map(block).join('\n')}
</body></html>`)

console.log('Wrote', emails.map(e => `preview/${e.file}.html`).join(', '), 'and preview/index.html')
