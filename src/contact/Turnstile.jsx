import { useEffect, useRef } from 'react'

// Cloudflare Turnstile: a bot check that stays invisible unless Cloudflare
// needs a click. Renders nothing when no site key is set (local preview).
export const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let loading
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ||= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = reject
    document.head.appendChild(s)
  })
  return loading
}

// onToken(token | null). Bump `resetKey` to ask for a fresh token (they're single-use).
export default function Turnstile({ onToken, resetKey }) {
  const box = useRef(null)
  const widget = useRef(null)

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false
    loadScript().then(ts => {
      if (cancelled || !box.current) return
      widget.current = ts.render(box.current, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        callback: token => onToken(token),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      })
    }).catch(() => onToken(null))
    return () => {
      cancelled = true
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current)
      widget.current = null
    }
  }, [])

  useEffect(() => {
    if (resetKey && widget.current && window.turnstile) {
      onToken(null)
      window.turnstile.reset(widget.current)
    }
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={box} className="turnstile" />
}
