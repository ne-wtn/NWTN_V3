// The first moments on the site. On the first page a visitor opens, the site stays hidden
// (plain paper) for a moment while its fonts and the images on the first screen arrive, then
// the nav fades in and the page rises into place (styles in base.css). Nothing pops in or
// swaps font in front of them, and nothing waits longer than LIMIT, so a slow file never
// keeps the page hidden. Moving between pages afterwards uses the page transitions instead.
//
// A custom intro (an animated logo, say) would play during this wait: startOpening is the place.

const LIMIT = 2000 // ms after the site's script starts
const SETTLE = 300 // ms after the page starts coming in, when `opened` resolves

let open
// Resolves once the page has come in, so things like the headline's 3D models can make
// their own entrance after it instead of hidden behind it.
export const opened = new Promise(resolve => { open = resolve })

export function startOpening() {
  const root = document.documentElement
  root.classList.add('is-opening')
  let shown = false
  const show = () => {
    if (shown) return
    shown = true
    root.classList.add('is-entering')
    root.classList.remove('is-opening')
    setTimeout(open, SETTLE)
    setTimeout(() => root.classList.remove('is-entering'), 1300)
  }
  setTimeout(show, LIMIT)
  // Once the first page has rendered, wait for what's on its first screen.
  const look = () => {
    if (!document.getElementById('main')) return requestAnimationFrame(look)
    requestAnimationFrame(() => Promise.all(firstScreen()).then(show, show))
  }
  requestAnimationFrame(look)
}

function firstScreen() {
  const onScreen = el => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight
  }
  const waits = ['400', '500', '600'].map(weight => document.fonts?.load(`${weight} 1em "Inter Tight"`))
  for (const img of document.querySelectorAll('#root img')) {
    if (img.complete || !onScreen(img)) continue
    waits.push(new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true })
      img.addEventListener('error', resolve, { once: true })
    }))
  }
  // A film's poster is what shows first, so that's what to wait for (not the film itself).
  for (const video of document.querySelectorAll('#root video[poster]')) {
    if (!onScreen(video)) continue
    waits.push(new Promise(resolve => {
      const still = new Image()
      still.onload = still.onerror = resolve
      still.src = video.poster
    }))
  }
  return waits
}
