// Sends one email through whichever service MAIL_PROVIDER names:
//
//   emailjs (default)  Sends through the Gmail account connected in EmailJS,
//                      so both emails come from nfxmotion@gmail.com.
//   resend             Sends from an address on your own domain (MAIL_FROM).
//   log                Sends nothing; prints the email in the terminal. For local testing.
//
// message: { to, replyTo, fromName, subject, html, text }

export async function sendMail(env, message) {
  const provider = (env.MAIL_PROVIDER || 'emailjs').toLowerCase()
  if (provider === 'log') return logMail(message)
  if (provider === 'resend') return resend(env, message)
  return emailjs(env, message)
}

// EmailJS REST API, called from the server with the private key, so nothing
// secret is in the page. Uses one EmailJS template for both emails: its fields
// are all filled from these values (see README, "EmailJS template").
//
// EmailJS takes at most one request a second, so each brief's two emails (Newton's,
// then the client's) go out a little over a second apart; one turned away for coming
// too soon is tried again.
const EMAILJS_GAP = 1100 // ms
let lastEmailjs = 0

async function emailjs(env, m) {
  need(env, ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY'])
  for (let attempt = 1; ; attempt++) {
    const wait = lastEmailjs + EMAILJS_GAP - Date.now()
    if (wait > 0) await new Promise(r => setTimeout(r, wait))
    lastEmailjs = Date.now()
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service_id: env.EMAILJS_SERVICE_ID,
        template_id: env.EMAILJS_TEMPLATE_ID,
        user_id: env.EMAILJS_PUBLIC_KEY,
        accessToken: env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: m.to,
          reply_to: m.replyTo,
          from_name: m.fromName,
          subject: m.subject,
          html: m.html,
        },
      }),
    })
    if (res.ok) return
    if (res.status === 429 && attempt < 3) continue
    throw new Error(`EmailJS ${res.status}: ${await res.text()}`)
  }
}

async function resend(env, m) {
  need(env, ['RESEND_API_KEY', 'MAIL_FROM'])
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: `${m.fromName} <${env.MAIL_FROM}>`,
      to: [m.to],
      reply_to: m.replyTo,
      subject: m.subject,
      html: m.html,
      text: m.text,
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
}

function logMail(m) {
  console.log(`\n--- email (not sent) ---\nFrom: ${m.fromName}\nTo: ${m.to}\nReply-To: ${m.replyTo}\nSubject: ${m.subject}\n\n${m.text}\n--- end ---\n`)
}

function need(env, names) {
  const missing = names.filter(n => !env[n])
  if (missing.length) throw new Error(`Missing settings: ${missing.join(', ')}`)
}
