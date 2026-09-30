// Draws the share image. The words and 3D models come from the site's own content files,
// so the banner says what the site says. ?v= picks the version:
//   a  the home page's headline and its 3D objects, on the hero's deep navy
//   b  brand blue, with one of the site's ribbons sweeping through
//   c  white, with the N mark at poster scale
import { home } from '../../src/content/home.js'
import { site } from '../../src/content/site.js'
import { mountModel } from '../../src/lib/model3d.js'

const banner = document.getElementById('banner')
const version = new URLSearchParams(location.search).get('v') || 'a'
const N_PATH = 'M14 6h80l33 48v223H14z M163 6h112v271h-79l-33-45z'
const domain = site.domain.replace(/^https?:\/\//, '')
const discipline = `${site.discipline}.`
const intro = 'I help SaaS brands turn complex features into short, cinematic films.'

function add(html, style) {
  const node = document.createElement('div')
  node.className = 'abs'
  node.innerHTML = html
  Object.assign(node.style, style)
  banner.append(node)
  return node
}
const mark = (color, extra = '') => `<svg viewBox="0 0 290 290" aria-hidden="true" ${extra}><path d="${N_PATH}" fill="${color}" stroke="${color}" stroke-width="12" stroke-linejoin="round"/></svg>`
const lockup = (markColor, textColor, size) => `<div class="lockup" style="font-size:${size}px;color:${textColor}">${mark(markColor)}<span>${site.wordmark}</span></div>`

// The site's ribbon curve (see src/lib/ribbons.js): a cubic B-spline that flows past its points.
function splinePath(pts) {
  const P = [pts[0], pts[0], ...pts, pts[pts.length - 1], pts[pts.length - 1]]
  const f = v => v.toFixed(1)
  const mix = (a, b, c, wa, wb, wc) => [0, 1].map(k => (a[k] * wa + b[k] * wb + c[k] * wc) / (wa + wb + wc))
  let d = ''
  for (let i = 1; i < P.length - 2; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1], e = P[i + 2]
    const start = mix(a, b, c, 1, 4, 1)
    const c1 = mix(b, c, c, 2, 1, 0)
    const c2 = mix(b, c, c, 1, 2, 0)
    const stop = mix(b, c, e, 1, 4, 1)
    if (!d) d = `M${f(start[0])},${f(start[1])}`
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(stop[0])},${f(stop[1])}`
  }
  return d
}
const BRAND = [[0, '#E7A6DA'], [0.22, '#C3A9F0'], [0.45, '#9EAAF4'], [0.66, '#5E8FDB'], [0.84, '#2F74B5'], [1, '#004B87']]

const waits = [document.fonts.ready]

if (version === 'a') {
  // A: the headline, as on the home page, with its 3D cursor, keycap and ball.
  banner.style.background = 'radial-gradient(120% 115% at 92% -12%, #004680 0%, #002B52 36%, #001830 68%, #000F20 100%)'
  add(lockup('#8DB4DC', '#FFFFFF', 30), { left: '64px', top: '54px' })
  const h1 = add('', { left: '64px', right: '64px', bottom: '138px' })
  h1.className += ' headline'
  for (const part of home.hero.headline) {
    if (typeof part === 'string') {
      // Two lines, broken where the home page breaks it: before the "&".
      const [before, after] = part.split(' & ')
      h1.append(before)
      if (after !== undefined) h1.append(document.createElement('br'), `& ${after}`)
      continue
    }
    const slot = document.createElement('span')
    slot.className = 'inline-model'
    slot.style.width = `${part.width}em`
    const canvas = document.createElement('canvas')
    slot.append(canvas)
    h1.append(slot)
    waits.push(new Promise(resolve => {
      mountModel(canvas, `/${part.src}`, { rotate: part.rotate, crop: part.crop, range: part.range, scale: part.scale, still: true, onReady: resolve, onError: resolve })
    }))
  }
  add(`<span class="lead" style="color:rgba(255,255,255,0.74)">${discipline.replace(/\.$/, '')} · Kuala Lumpur</span>`, { left: '64px', bottom: '56px' })
  add(`<span class="url" style="color:#FFFFFF">${domain}</span>`, { right: '64px', bottom: '56px' })
}

if (version === 'b') {
  // B: brand blue, and one ribbon sweeping up from the bottom, looping once and leaving right.
  banner.style.background = 'linear-gradient(180deg, #004B87 0%, #00427A 100%)'
  const pts = [[520, 760], [590, 610], [700, 540], [850, 500], [1000, 470], [1085, 380], [1080, 230], [990, 140], [870, 150], [815, 250], [860, 370], [980, 440], [1110, 470], [1320, 470]]
  const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1]
  add(`<svg width="1200" height="630" viewBox="0 0 1200 630" style="display:block;overflow:visible">
    <defs><linearGradient id="rib" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${BRAND.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
    <path d="${splinePath(pts)}" fill="none" stroke="url(#rib)" stroke-width="62" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`, { left: '0', top: '0' })
  add(lockup('#8DB4DC', '#FFFFFF', 30), { left: '64px', top: '54px' })
  add(`<h1 class="display" style="font-size:78px;color:#FFFFFF;width:560px">${discipline}</h1>
       <p class="lead" style="color:rgba(255,255,255,0.78);width:470px;margin-top:26px">${intro}</p>`, { left: '64px', top: '172px' })
  add(`<span class="url" style="color:#FFFFFF">${domain}</span>`, { left: '64px', bottom: '56px' })
}

if (version === 'c') {
  // C: white, with the N mark at poster scale, bleeding off the top, right and bottom.
  banner.style.background = '#FFFFFF'
  add(mark('#004B87', 'width="700" height="700" style="display:block"'), { left: '566px', top: '-38px' })
  add(`<div class="lockup" style="font-size:36px;color:#0E0F11"><span>${site.wordmark}</span></div>`, { left: '64px', top: '54px' })
  add(`<h1 class="display" style="font-size:72px;color:#0E0F11;width:470px">${discipline}</h1>
       <p class="lead" style="color:#5E636B;width:430px;margin-top:24px">${intro}</p>`, { left: '64px', top: '166px' })
  add(`<span class="url" style="color:#0E0F11">${domain}</span>`, { left: '64px', bottom: '56px' })
}

Promise.all(waits).then(() => requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true })))
