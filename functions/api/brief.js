// POST /api/brief — receives a brief from the contact form, checks it,
// then emails Newton and sends the client their confirmation.
// Runs on Cloudflare Pages Functions. Settings live in the Pages project
// (Settings → Variables and secrets); see README, "Contact form: sending".

import { cleanBrief } from '../../src/contact/briefData.js'
import { site } from '../../src/content/site.js'
import { notifyEmail, replyEmail } from '../../emails/brief.js'
import { verifyTurnstile } from '../../server/turnstile.js'
import { sendMail } from '../../server/mail.js'

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'bad_request' })
  }

  // The hidden spam trap was filled in: a bot. Pretend it worked, send nothing.
  if (body?.trap) return json(200, { ok: true })

  // Bot check. Skipped only when no secret is set (local testing).
  if (env.TURNSTILE_SECRET) {
    const ip = request.headers.get('CF-Connecting-IP')
    if (!(await verifyTurnstile(body?.turnstileToken, env.TURNSTILE_SECRET, ip))) return json(403, { error: 'verification_failed' })
  }

  const { values, errors } = cleanBrief(body?.values)
  if (Object.keys(errors).length) return json(422, { error: 'invalid', fields: errors })

  const inbox = env.NOTIFY_TO || site.email
  const notify = notifyEmail(values, { at: new Date() })
  const reply = replyEmail(values)

  // Newton's copy first: if that fails, the client sees the error and can try again.
  try {
    await sendMail(env, { to: inbox, replyTo: values.email, fromName: 'Newtn brief form', ...notify })
  } catch (err) {
    console.error('Brief notification failed:', err.message)
    return json(502, { error: 'send_failed' })
  }

  // The brief has reached Newton, so the visitor has succeeded even if their copy fails.
  try {
    await sendMail(env, { to: values.email, replyTo: inbox, fromName: site.person, ...reply })
  } catch (err) {
    console.error('Brief confirmation failed:', err.message)
  }

  return json(200, { ok: true })
}

export const onRequest = () => json(405, { error: 'method_not_allowed' })
