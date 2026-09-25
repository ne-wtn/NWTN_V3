// A sound wave that plays: rounded bars in the ribbon's gradient, tallest in the middle,
// moving the way a level meter does while a track plays. Each bar jumps on the beat and
// falls back a little slower, the bars move out of step with each other, and the whole
// thing breathes louder and quieter. It grows in from the middle when it first comes
// into view, and only animates while on screen.
//
// It fills the element it's given (components/SoundWave.jsx), which sits in the layout
// just above a band's paragraph.
//
// Given a levels file (made from a real song with tools/levels.py), the bars replay that
// song's levels on a loop instead: bass in the middle, higher sounds towards the edges.
// No audio is loaded or played, only the numbers. The song runs on the page's clock from
// the moment the site loads, so whenever the bars come into view they show wherever the
// song has got to, like a track that's been playing all along.

// The light end of the brand gradient, so it glows against the deep blue.
const PAINT = [[0, '#8DB4DC'], [0.35, '#9EAAF4'], [0.65, '#C3A9F0'], [1, '#E7A6DA']]
const BPM = 124

const SVGNS = 'http://www.w3.org/2000/svg'
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(SVGNS, tag)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v)
  return n
}
const clamp = (n, a, b) => Math.max(a, Math.min(b, n))
const smooth = t => t * t * (3 - 2 * t)
// A repeatable random number per bar, so the shape doesn't change on every resize.
const rand = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

let uid = 0

export function startSoundwave(box, { still = false, levels = null, start = 0 } = {}) {
  const id = `sw${++uid}`
  const svg = el('svg', { class: 'soundwave-svg' })
  box.append(svg)

  let bars = []
  let cy = 0
  let maxH = 0
  let bw = 0

  function build() {
    const W = box.clientWidth
    const H = box.clientHeight
    if (!W || !H) return
    // Bar thickness follows the screen; as many bars as fit, starting from the left edge.
    bw = innerWidth >= 900 ? clamp(innerWidth * 0.0062, 6, 10) : clamp(innerWidth * 0.014, 4, 6)
    const pitch = bw * 2.3
    const count = Math.max(5, Math.floor((W + pitch - bw) / pitch))
    const span = count * pitch - (pitch - bw)
    const left = 0
    cy = H / 2
    maxH = Math.max(bw * 2, H)

    svg.replaceChildren()
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    const lg = el('linearGradient', { id: `${id}-paint`, gradientUnits: 'userSpaceOnUse', x1: left, y1: 0, x2: left + span, y2: 0 })
    PAINT.forEach(([o, c]) => lg.append(el('stop', { offset: o, 'stop-color': c })))
    const defs = el('defs')
    defs.append(lg)
    svg.append(defs)

    const old = bars
    bars = Array.from({ length: count }, (_, i) => {
      const x = left + bw / 2 + i * pitch
      const pos = count > 1 ? (i / (count - 1)) * 2 - 1 : 0 // -1 … 1 across the wave
      // The shape: tallest in the middle, tapering out, a little uneven like a real waveform.
      const env = clamp((0.3 + 0.7 * Math.exp(-(pos * pos) / 0.32)) * (0.82 + 0.36 * rand(i)), 0.25, 1)
      const line = el('line', { x1: x, x2: x, stroke: `url(#${id}-paint)`, 'stroke-width': bw, 'stroke-linecap': 'round' })
      svg.append(line)
      return {
        line, env, pos,
        delay: Math.abs(pos) * 0.45, // grows in from the middle outwards
        f: 3 + rand(i + 50) * 6, p: rand(i + 90) * 6.28,
        g: 2 + rand(i + 130) * 5, q: rand(i + 170) * 6.28,
        kick: 0.55 + 0.45 * rand(i + 210),
        h: old[i]?.h ?? (still ? env : 0),
      }
    })
    draw(still ? Infinity : introAt === null ? 0 : clock - introAt)
  }

  function draw(sinceIntro) {
    for (const b of bars) {
      const grow = smooth(clamp((sinceIntro - b.delay) / 0.6, 0, 1))
      const h = Math.max(bw, maxH * b.h * grow)
      const half = Math.max(0, h / 2 - bw / 2)
      b.line.setAttribute('y1', (cy - half).toFixed(1))
      b.line.setAttribute('y2', (cy + half).toFixed(1))
    }
  }

  // The "music": a beat every bar-length, a quieter off-beat, and a slow swell.
  let clock = 0
  let introAt = null
  let pulse = 0
  let nextBeat = 0
  let beatCount = 0
  const beat = 60 / BPM

  // A song's levels, once loaded: { fps, bands, frames, data }
  let track = null
  if (levels) {
    fetch(levels)
      .then(r => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then(buf => {
        const v = new DataView(buf)
        if (String.fromCharCode(v.getUint8(0), v.getUint8(1), v.getUint8(2), v.getUint8(3)) !== 'LVL1') return
        track = { fps: v.getUint8(4), bands: v.getUint8(5), frames: v.getUint32(6, true), data: new Uint8Array(buf, 10) }
      })
      .catch(() => {}) // keeps the built-in rhythm if the file can't load
  }

  // The song's level for one bar at one moment, blended between frames and bands.
  function songLevel(t, pos) {
    const { fps, bands, frames, data } = track
    const at = t * fps
    const f0 = Math.floor(at) % frames
    const f1 = (f0 + 1) % frames
    const kf = at - Math.floor(at)
    const u = Math.abs(pos) * (bands - 1)
    const b0 = Math.floor(u)
    const b1 = Math.min(bands - 1, b0 + 1)
    const kb = u - b0
    const get = (f, b) => data[f * bands + b] / 255
    const a = get(f0, b0) * (1 - kb) + get(f0, b1) * kb
    const c = get(f1, b0) * (1 - kb) + get(f1, b1) * kb
    return a * (1 - kf) + c * kf
  }

  function step(dt, jumped) {
    clock += dt
    if (track) {
      // Seconds since the site loaded, so the song has been "playing" from the start.
      const length = track.frames / track.fps
      const t = (((performance.now() / 1000 + start) % length) + length) % length // loops forever
      for (const b of bars) {
        const target = songLevel(t, b.pos) * (0.55 + 0.45 * b.env)
        // Coming back into view: show the song's current moment straight away.
        if (jumped) b.h = target
        else b.h += (target - b.h) * (1 - Math.exp(-dt * (target > b.h ? 30 : 10)))
      }
      draw(Infinity)
      return
    }
    if (clock >= nextBeat) {
      pulse = beatCount % 2 === 0 ? 1 : 0.55 + 0.25 * rand(beatCount)
      beatCount++
      nextBeat = clock + beat * (0.94 + 0.12 * rand(beatCount + 400))
    }
    pulse *= Math.exp(-dt * 5.5)
    const swell = 0.78 + 0.22 * Math.sin(clock * 0.6)
    for (const b of bars) {
      const wobble = 0.5 + 0.5 * Math.sin(clock * b.f + b.p) * Math.cos(clock * b.g + b.q)
      const target = b.env * clamp((0.3 + 0.45 * wobble + 0.55 * pulse * b.kick) * swell, 0.12, 1)
      // Rises fast, falls back slower, like a level meter.
      const rate = target > b.h ? 28 : 7
      b.h += (target - b.h) * (1 - Math.exp(-dt * rate))
    }
    draw(clock - introAt)
  }

  let raf = 0
  let last = 0
  let onScreen = false
  const frame = now => {
    raf = 0
    if (!onScreen || document.hidden) return
    const gap = (now - last) / 1000
    last = now
    step(Math.min(0.05, gap), gap > 0.25)
    raf = requestAnimationFrame(frame)
  }
  const play = () => {
    if (still || raf || !onScreen || document.hidden) return
    if (introAt === null) introAt = clock
    // Starting (or returning) after time away counts as a jump, so a song shows its current moment at once.
    last = performance.now() - 1000
    raf = requestAnimationFrame(frame)
  }

  build()
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; play() })
  io.observe(box)
  document.addEventListener('visibilitychange', play)
  let rebuild = 0
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rebuild)
    rebuild = requestAnimationFrame(build)
  })
  ro.observe(box)

  return () => {
    cancelAnimationFrame(raf)
    cancelAnimationFrame(rebuild)
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', play)
    svg.remove()
  }
}
