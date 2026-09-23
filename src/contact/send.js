// Sends the brief to the site's own endpoint (functions/api/brief.js), which
// checks it and emails both Newton and the client.
//
// Preview mode (nothing is sent) is on in `npm run dev` and in the shareable
// preview build. Force it either way with VITE_FORM_DEMO=true / false.
// In preview mode, a name of "fail" shows the error message.

const flag = import.meta.env.VITE_FORM_DEMO
export const demoMode = flag ? flag === 'true' : import.meta.env.DEV || import.meta.env.MODE === 'artifact'

const ENDPOINT = import.meta.env.VITE_BRIEF_ENDPOINT || '/api/brief'

export async function sendBrief({ values, turnstileToken, trap }) {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 1400))
    if (values.name.trim().toLowerCase() === 'fail') throw new Error('Demo failure')
    return
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ values, turnstileToken, trap }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw Object.assign(new Error(detail.error || `HTTP ${res.status}`), { status: res.status, fields: detail.fields })
  }
}
