// Ribbons that draw themselves across a section as it scrolls into view, always
// behind the section's text and images. They stay fixed in place: scrolling only
// draws them in (and back out when you scroll up).
// Each ribbon is a long, smooth curve guided by a few anchor points. Its bends are
// kept much wider than the ribbon itself, so its edges stay clean. Scrolling back up
// rewinds the drawing.

// Colours, all from the site's palette. On dark sections, 'brand' and 'soft' switch
// to 'dusk' automatically, so white text on top stays readable.
const PAINTS = {
  brand: [[0, '#E7A6DA'], [0.22, '#C3A9F0'], [0.45, '#9EAAF4'], [0.66, '#5E8FDB'], [0.84, '#2F74B5'], [1, '#004B87']],
  soft: [[0, '#E7A6DA'], [0.35, '#C3A9F0'], [0.7, '#9EAAF4'], [1, '#8DB4DC']],
  dusk: [[0, '#2F74B5'], [0.5, '#5A80D8'], [1, '#8A7FD6']],
}

// Routes: one ribbon each, with a layout for wide screens and one for phones (tall).
//   anchors  [x, y] as fractions of the section (x across the full window width, y down
//            the section), or ['selector', x, y] as fractions of an element inside it
//   width    × the base width
//   paint    'brand' | 'soft' | 'dusk'
//   grad     [x1, y1, x2, y2] where the paint runs from and to (fractions of the section);
//            by default it runs from the ribbon's first anchor to its last
//   draw     [start, end] share of the scroll over which it draws
const ROUTES = {
  // Home, storyboard band: up behind the text, a loop behind the heading, away behind the photo.
  weave: {
    wide: { width: 1.06, paint: 'brand', grad: [0, 0.2, 1, 0.8],
      anchors: [[-0.1, 0.95], [0.08, 0.7], [0.15, 0.38], [0.29, 0.12], [0.47, 0.1], [0.58, 0.3], [0.52, 0.58], [0.38, 0.84], [0.25, 0.68], [0.3, 0.47], [0.5, 0.49], [0.72, 0.6], [0.9, 0.9], [1.12, 1.04]] },
    tall: { width: 1, paint: 'brand', grad: [0, 0, 0.3, 1],
      anchors: [[-0.15, 0.32], [0.3, 0.13], [0.74, 0.05], [1.02, 0.18], [0.92, 0.38], [0.5, 0.48], [0.14, 0.62], [0.16, 0.84], [0.5, 0.97], [1.15, 0.9]] },
  },

  // Home, Tech = Motion: an After Effects motion path, rising from behind the screenshot,
  // arcing over the heading and easing down the far edge.
  'motion-path': {
    wide: { width: 0.9, paint: 'brand',
      anchors: [[-0.08, 0.97], [0.2, 0.94], [0.44, 0.9], [0.52, 0.6], [0.54, 0.26], [0.62, 0.08], [0.8, 0.05], [0.97, 0.18], [1.02, 0.5], [0.98, 0.85], [1.04, 1.1]] },
    tall: { width: 1, paint: 'brand', grad: [0.5, 0, 0.5, 1],
      anchors: [[-0.1, 1.03], [0.4, 0.99], [0.8, 0.84], [1.04, 0.55], [1.02, 0.35], [0.82, 0.1], [0.55, 0.04], [0.3, 0.1], [-0.1, 0.06]] },
  },

  // Home, closing section: the ribbon winds in, loops once and plugs into the button.
  'to-button': {
    wide: { width: 0.7, paint: 'brand',
      anchors: [[-0.08, 0.3], [0.12, 0.14], [0.3, 0.24], [0.36, 0.56], [0.3, 0.97], [0.12, 0.9], [0.13, 0.6], [0.34, 0.66], [0.5, 0.9], [0.57, 0.78], ['.btn', 0.12, 0.5]] },
    tall: { width: 0.6, paint: 'brand',
      anchors: [[-0.1, 0.1], [0.4, 0.03], [0.85, 0.1], [1.0, 0.42], [0.97, 0.8], [0.78, 0.95], [0.64, 0.88], ['.btn', 0.92, 0.5]] },
  },
}

const SVGNS = 'http://www.w3.org/2000/svg'
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(SVGNS, tag)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v)
  return n
}
const clamp01 = n => Math.max(0, Math.min(1, n))
const smooth = t => t * t * (3 - 2 * t)

// A streamlined curve guided by the points (a cubic B-spline): it flows past each point
// rather than being forced through it, so its bend changes gradually everywhere and
// there are no kinks. The ends are pinned so it starts and finishes where asked.
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

// Is this section's background dark?
function isDark(section) {
  const m = getComputedStyle(section).backgroundColor.match(/[\d.]+/g)
  if (!m || (m[3] !== undefined && +m[3] === 0)) return false
  const [r, g, b] = m.map(Number)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 90
}

let uid = 0

export function startRibbons(section, name, { still = false } = {}) {
  const route = ROUTES[name]
  if (!route) return () => {}
  const id = `rb${++uid}`
  const dark = isDark(section)

  const svg = el('svg', { class: 'ribbons', 'aria-hidden': 'true' })
  section.prepend(svg)
  let stroke = null

  function build() {
    const box = svg.getBoundingClientRect()
    const W = box.width
    const H = box.height
    if (!W || !H) return
    // Phones use the tall layout; tablets do when their sections stack up tall; desktops never.
    const tall = W < 700 || (W < 900 && H > W * 0.9)
    const def = route[tall ? 'tall' : 'wide']
    const base = tall ? Math.max(26, Math.min(46, W * 0.11)) : Math.max(32, Math.min(72, W * 0.045))

    const place = a => {
      if (typeof a[0] !== 'string') return [a[0] * W, a[1] * H]
      const target = section.querySelector(a[0])
      if (!target) return [a[1] * W, a[2] * H]
      const t = target.getBoundingClientRect()
      return [t.left - box.left + a[1] * t.width, t.top - box.top + a[2] * t.height]
    }
    const pts = def.anchors.map(place)
    const [x1, y1, x2, y2] = def.grad
      ? [def.grad[0] * W, def.grad[1] * H, def.grad[2] * W, def.grad[3] * H]
      : [...pts[0], ...pts[pts.length - 1]]

    svg.replaceChildren()
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    const lg = el('linearGradient', { id: `${id}-paint`, gradientUnits: 'userSpaceOnUse', x1, y1, x2, y2 })
    PAINTS[dark ? 'dusk' : def.paint].forEach(([o, c]) => lg.append(el('stop', { offset: o, 'stop-color': c })))
    const defs = el('defs')
    defs.append(lg)
    svg.append(defs)

    const path = el('path', {
      d: splinePath(pts), fill: 'none', stroke: `url(#${id}-paint)`, 'stroke-width': base * def.width,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    })
    svg.append(path)
    const total = path.getTotalLength()
    path.style.strokeDasharray = `${total} ${total}`
    stroke = { def, path, total }
  }

  let shown = 0
  let wanted = 0
  const progress = () => {
    // At the very bottom of the page, everything is fully drawn.
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) return 1
    const r = section.getBoundingClientRect()
    const vh = innerHeight
    return clamp01((vh * 0.95 - r.top) / (r.height * 0.6 + vh * 0.5))
  }

  function paint() {
    if (!stroke) return
    const [a, b] = stroke.def.draw || [0, 1]
    const drawn = smooth(clamp01((shown - a) / (b - a))) * stroke.total
    stroke.path.style.strokeDashoffset = stroke.total - drawn
    stroke.path.style.visibility = drawn > 0.5 ? 'visible' : 'hidden'
  }

  // Every scroll: ribbons off screen jump straight to where they should be for the
  // visitor's position (so nothing is left to catch up when they arrive); ribbons on
  // screen draw towards it, following the scroll closely.
  let raf = 0
  let last = performance.now()
  const onScreen = () => {
    const r = section.getBoundingClientRect()
    return r.bottom > 0 && r.top < innerHeight
  }
  const tick = now => {
    raf = 0
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    wanted = progress()
    if (!onScreen()) {
      if (shown === wanted) return
      shown = wanted
    } else {
      shown += (wanted - shown) * (1 - Math.exp(-dt * 14))
      if (Math.abs(wanted - shown) < 0.0005) shown = wanted
    }
    paint()
    if (shown !== wanted) raf = requestAnimationFrame(tick)
  }
  const kick = () => {
    if (still || raf) return
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }

  // Ready before it's needed: ribbons already scrolled past start fully drawn, ones on
  // screen draw in, ones further down wait at the start.
  build()
  wanted = still ? 1 : progress()
  if (still || !onScreen()) shown = wanted
  paint()
  kick()
  addEventListener('scroll', kick, { passive: true })
  let rebuild = 0
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rebuild)
    rebuild = requestAnimationFrame(() => { build(); paint(); kick() })
  })
  ro.observe(section)

  return () => {
    cancelAnimationFrame(raf)
    cancelAnimationFrame(rebuild)
    ro.disconnect()
    removeEventListener('scroll', kick)
    svg.remove()
  }
}
