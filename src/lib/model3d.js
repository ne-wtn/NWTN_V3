// A small 3D model in the headline that looks at the cursor. It rests facing forward
// and turns towards wherever the cursor is, from its own spot on the page, with a soft,
// weighted follow; when the cursor leaves the window it eases back to rest.
// Loaded on demand (three.js only downloads on pages that use it) and idle while off
// screen, in a hidden tab, or when nothing is moving.
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// Where the cursor is, shared by every model.
const pointer = { x: 0, y: 0, active: false }
let listening = false
function listen() {
  if (listening) return
  listening = true
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true }, { passive: true })
  document.documentElement.addEventListener('mouseleave', () => { pointer.active = false })
}

const REACH = 0.45 // how strongly it turns: the cursor this share of the screen away ≈ 45°
const FOLLOW = 4 // how quickly it catches up with the cursor (higher = snappier)
const MAX_TURN = 1.2 // cap on the turn (tan of ~50°), so flat models never go edge-on

// options:
//   rotate  resting angle in degrees [x, y, z], so the side you want faces the viewer
//   crop    keep only this front share of the model (0–1), e.g. just the top of a keycap
//   range   how far it turns towards the cursor (1 = full, 0.5 = half)
//   scale   size within its slot (1 = fills it; round models like a ball look right smaller)
//   still   no movement (reduced motion)
export function mountModel(canvas, src, { rotate = [0, 0, 0], crop = 1, range = 1, scale = 1, still = false, onError } = {}) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  } catch {
    onError?.()
    return () => {}
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  // Soft studio light with a brand-blue rim from behind.
  const key = new THREE.DirectionalLight(0xffffff, 1.4)
  key.position.set(2, 3, 4)
  const rim = new THREE.DirectionalLight(0x8db4dc, 3.2)
  rim.position.set(-3, 1.5, -2.5)
  scene.add(key, rim)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  // Model size: larger number = smaller model (1.31 is 80% of the size at 1.05).
  camera.position.set(0, 0, (1 / Math.sin(THREE.MathUtils.degToRad(15))) * 1.31)
  const pivot = new THREE.Group()
  scene.add(pivot)

  // Trimming: a plane that moves with the model, cutting away everything behind it.
  let cutLocal = null
  const cutWorld = new THREE.Plane()

  let disposed = false
  let visible = false
  let raf = 0
  let dirty = true
  let last = performance.now()
  const aim = new THREE.Object3D()
  const target = new THREE.Quaternion()

  const size = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    dirty = true
  }
  size()

  function aimAtCursor() {
    if (still || !pointer.active) return target.identity()
    const r = canvas.getBoundingClientRect()
    const scale = Math.max(innerWidth, innerHeight) * REACH
    const dx = ((pointer.x - (r.left + r.width / 2)) / scale) * range
    const dy = ((pointer.y - (r.top + r.height / 2)) / scale) * range
    const clamp = n => Math.max(-MAX_TURN, Math.min(MAX_TURN, n))
    aim.lookAt(clamp(dx), clamp(-dy), 1)
    return target.copy(aim.quaternion)
  }

  function render(now = performance.now()) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    aimAtCursor()
    const settled = pivot.quaternion.angleTo(target) < 0.0005
    if (!settled) pivot.quaternion.slerp(target, 1 - Math.exp(-dt * FOLLOW))
    if (settled && !dirty) return
    dirty = false
    if (cutLocal) {
      pivot.updateMatrixWorld()
      cutWorld.copy(cutLocal).applyMatrix4(pivot.matrixWorld)
    }
    renderer.render(scene, camera)
  }

  const frame = now => {
    raf = 0
    if (disposed || !visible || document.hidden) return
    render(now)
    raf = requestAnimationFrame(frame)
  }
  const start = () => {
    if (raf || !visible || document.hidden || !pivot.children.length) return
    if (still) { render(); return }
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(() => { size(); if (!raf) render() })
  ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start() })
  io.observe(canvas)
  document.addEventListener('visibilitychange', start)
  listen()

  new GLTFLoader().load(src, gltf => {
    if (disposed) return
    // Resting angle first, then centre and scale to a sphere of radius 1.
    const orient = new THREE.Group()
    orient.rotation.set(...rotate.map(THREE.MathUtils.degToRad))
    orient.add(gltf.scene)
    const holder = new THREE.Group()
    holder.add(orient)
    holder.updateMatrixWorld(true)

    // Every vertex in the holder's space: used to frame (and trim) precisely.
    const points = []
    const v = new THREE.Vector3()
    gltf.scene.traverse(o => {
      if (!o.isMesh) return
      const pos = o.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) points.push(v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).clone())
    })
    let keep = points
    let cutZ = -Infinity
    if (crop < 1) {
      const zs = points.map(p => p.z)
      const zMax = Math.max(...zs)
      const zMin = Math.min(...zs)
      cutZ = zMax - crop * (zMax - zMin)
      keep = points.filter(p => p.z >= cutZ)
    }
    const sphere = new THREE.Sphere().setFromPoints(keep)
    orient.position.sub(sphere.center)
    holder.scale.setScalar(scale / sphere.radius)
    pivot.add(holder)

    if (crop < 1) {
      // The cut, in the pivot's own space (so it turns with the model).
      cutLocal = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(cutZ - sphere.center.z) / sphere.radius)
      renderer.clippingPlanes = [cutWorld]
    }
    dirty = true
    render()
    start()
  }, undefined, () => onError?.())

  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', start)
    scene.traverse(o => {
      o.geometry?.dispose()
      ;[].concat(o.material || []).forEach(m => m.dispose())
    })
    pmrem.dispose()
    renderer.dispose()
  }
}
