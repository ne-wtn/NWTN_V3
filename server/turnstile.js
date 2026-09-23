// Confirms the Turnstile token the browser got is real and fresh.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
export async function verifyTurnstile(token, secret, ip) {
  if (!token) return false
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
  if (!res.ok) return false
  const data = await res.json()
  return data.success === true
}
