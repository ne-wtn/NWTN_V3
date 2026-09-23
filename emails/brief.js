// The two emails sent for every brief:
//   notifyEmail → to Newton, with everything the client wrote
//   replyEmail  → to the client, confirming it arrived, with a copy of their brief
// Both return { subject, preheader, html, text }. They read the same content files
// as the site, so labels and answer wording stay in sync.
//
// Email HTML is old-school on purpose (tables, inline styles): it's what Gmail,
// Outlook and phone mail apps render reliably.

import { contact } from '../src/content/contact.js'
import { site } from '../src/content/site.js'
import { briefRows, phrase } from '../src/contact/briefData.js'

const F = "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const C = {
  page: '#EEF3F8',
  paper: '#FFFFFF',
  ink: '#0E0F11',
  ink2: '#34373D',
  grey: '#5E636B',
  rule: '#D9DCE0',
  blue: '#004B87',
  blue100: '#DCE8F4',
  blueLine: '#2E6B9D', // white at 18% over the brand blue, solid so Outlook draws it too
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const multiline = s => esc(s).replace(/\r?\n/g, '<br>')
const firstName = values => values.name.trim().split(/\s+/)[0] || 'there'
const when = at => at.toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const replyTime = site.replyTime

/* ---------- Building blocks ---------- */

function layout({ title, preheader, body, footer, assets }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  a { color: ${C.blue}; }
  @media (max-width: 620px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .card-px { padding-left: 18px !important; padding-right: 18px !important; }
    .h1 { font-size: 28px !important; line-height: 1.15 !important; }
    .label-col { width: 64px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}${'&#8199;&#65279;&#847; '.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr>
    <td align="center" style="padding:32px 12px 40px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td style="padding:0 6px 20px;">
            <a href="${esc(site.domain)}" style="text-decoration:none;color:${C.ink};">
              <img src="${esc(assets)}/email/mark-blue.png" width="26" height="26" alt="" style="display:inline-block;vertical-align:middle;border:0;">
              <span style="display:inline-block;vertical-align:middle;margin-left:8px;font:600 20px/1 ${F};letter-spacing:-0.7px;color:${C.ink};">${esc(site.wordmark)}</span>
            </a>
          </td>
        </tr>
        <tr>
          <td class="px" style="background:${C.paper};border-radius:14px;padding:40px 40px 36px;">
${body}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 6px 0;font:13px/1.6 ${F};color:${C.grey};">
${footer}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

const text = (s, style = '') => `<p style="margin:0 0 16px;font:16px/1.6 ${F};color:${C.ink2};${style}">${s}</p>`

function button(href, label, { light = false } = {}) {
  const bg = light ? C.paper : C.ink
  const fg = light ? C.ink : '#FFFFFF'
  const border = light ? C.rule : C.ink
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 10px 10px 0;">
  <tr><td style="border-radius:6px;background:${bg};">
    <a href="${esc(href)}" style="display:inline-block;padding:14px 22px;font:600 15px/1 ${F};color:${fg};text-decoration:none;border:1px solid ${border};border-radius:6px;">${esc(label)}</a>
  </td></tr>
</table>`
}

// The blue brief card, the same one as on the site.
function briefCard(rows, title) {
  const done = rows.filter(r => r.value).length
  const cells = rows.map((r, i) => {
    const line = i === 0 ? 'none' : `1px solid ${C.blueLine}`
    const value = r.value
      ? r.href
        ? `<a href="${esc(r.href)}" style="color:#FFFFFF;text-decoration:underline;">${multiline(r.value)}</a>`
        : multiline(r.value)
      : '<span style="color:#7FA3C6;">—</span>'
    return `<tr>
      <td class="label-col" width="84" valign="top" style="width:84px;padding:11px 0;border-top:${line};font:14px/1.45 ${F};color:${C.blue100};">${esc(r.label)}</td>
      <td valign="top" style="padding:11px 0;border-top:${line};font:500 16px/1.45 ${F};color:#FFFFFF;">${value}</td>
    </tr>`
  }).join('\n')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.blue};border-radius:12px;margin:8px 0 28px;">
  <tr>
    <td class="card-px" style="padding:22px 24px 10px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font:600 24px/1.1 ${F};letter-spacing:-0.7px;color:#FFFFFF;">${esc(title)}</td>
          <td align="right" style="font:14px/1 ${F};color:${C.blue100};">${done}/${rows.length}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td class="card-px" style="padding:6px 24px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.blueLine};">
${cells}
      </table>
    </td>
  </tr>
</table>`
}

const plainBrief = rows => rows.map(r => `${r.label}: ${r.value || '—'}`).join('\n')

/* ---------- To Newton ---------- */

export function notifyEmail(values, { at = new Date(), assets = `${site.domain}/media` } = {}) {
  const name = values.name.trim()
  const company = values.company.trim()
  const want = phrase('goal', values)
  const digits = values.phone.replace(/[^\d]/g, '')

  const rows = briefRows(values).map(r => {
    if (r.id === 'email') return { ...r, href: `mailto:${values.email.trim()}` }
    if (r.id === 'phone') return { ...r, href: `tel:${values.phone.replace(/[^\d+]/g, '')}` }
    return r
  })

  const subject = `New brief: ${name}, ${company}`
  const preheader = [phrase('goal', values), rows.find(r => r.id === 'budget')?.value, values.deadline.trim() && `due ${values.deadline.trim()}`].filter(Boolean).join(' · ')

  const body = `
<p style="margin:0 0 10px;font:600 14px/1 ${F};color:${C.blue};">New brief</p>
<h1 class="h1" style="margin:0 0 14px;font:500 32px/1.12 ${F};letter-spacing:-1px;color:${C.ink};">${esc(name)} from ${esc(company)} wants ${esc(want)}.</h1>
${text(`Received ${esc(when(at))}, Kuala Lumpur time.`, `color:${C.grey};font-size:14px;margin-bottom:22px;`)}
${briefCard(rows, 'The brief')}
${button(`mailto:${values.email.trim()}?subject=${encodeURIComponent('Re: your brief')}`, `Reply to ${firstName(values)}`)}${digits ? button(`https://wa.me/${digits}`, 'WhatsApp', { light: true }) : ''}`

  const footer = `Sent by the brief form on ${esc(site.domain.replace(/^https?:\/\//, ''))}. Pressing Reply writes to ${esc(name)} directly.`

  const plain = `New brief from ${name}, ${company}
${name} wants ${want}.
Received ${when(at)}, Kuala Lumpur time.

${plainBrief(rows)}

Reply to ${values.email.trim()}${digits ? ` or WhatsApp https://wa.me/${digits}` : ''}`

  return { subject, preheader, html: layout({ title: subject, preheader, body, footer, assets }), text: plain }
}

/* ---------- To the client ---------- */

export function replyEmail(values, { assets = `${site.domain}/media` } = {}) {
  const first = firstName(values)
  const rows = briefRows(values)

  const subject = `Got your brief, ${first}`
  const preheader = `I’ll reply within ${replyTime}. Here’s a copy of what you sent.`

  const body = `
<h1 class="h1" style="margin:0 0 18px;font:500 34px/1.1 ${F};letter-spacing:-1.1px;color:${C.ink};">Got it, ${esc(first)}.</h1>
${text(`Thanks for sending your brief. I’ll go through it properly and get back to you within <strong style="color:${C.ink};font-weight:600;">${esc(replyTime)}</strong>, stg.`)}
${text('Here’s a copy of what you sent. If anything’s missing or you’ve had a new idea since, just reply to this email.', 'margin-bottom:22px;')}
${briefCard(rows, contact.brief.title)}
${button(`${site.domain}/projects`, contact.sent.cta.label)}
<p style="margin:26px 0 0;font:16px/1.6 ${F};color:${C.ink2};">Talk soon,<br><span style="color:${C.ink};font-weight:600;">Newton</span></p>`

  const footer = `${esc(site.person)} · ${esc(site.discipline)} · ${esc(site.location)}<br>
<a href="${esc(site.instagram.url)}" style="color:${C.grey};">Instagram</a> &nbsp;·&nbsp; <a href="${esc(site.linkedin)}" style="color:${C.grey};">LinkedIn</a> &nbsp;·&nbsp; <a href="${esc(site.domain)}" style="color:${C.grey};">${esc(site.domain.replace(/^https?:\/\//, ''))}</a><br>
You’re getting this because you sent a brief on ${esc(site.domain.replace(/^https?:\/\//, ''))}.`

  const plain = `Got it, ${first}.

Thanks for sending your brief. I’ll go through it properly and get back to you within ${replyTime}.

Here’s a copy of what you sent. If anything’s missing, just reply to this email.

${plainBrief(rows)}

See selected work: ${site.domain}/projects

Talk soon,
Newton

${site.person} · ${site.discipline} · ${site.location}`

  return { subject, preheader, html: layout({ title: subject, preheader, body, footer, assets }), text: plain }
}
