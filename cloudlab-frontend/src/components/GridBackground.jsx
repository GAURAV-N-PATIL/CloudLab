import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

// A fixed, static grid behind every page (the page scrolls over it, the grid never moves).
// - A canvas draws the lines, intersection nodes and a few hatched cells once per resize.
// - When a mouse is present, the cell under the cursor lights up (GSAP) and fades out
//   slowly after the cursor leaves it, leaving a short trail.
// Touch devices and "reduce motion" users get the static grid only.
const CELL = 88
const NAV_HEIGHT = 66 // a grid line sits exactly on the nav bar's bottom edge
const POOL_SIZE = 14

// Small integer hash so the hatched cells are the same on every load and resize.
function hash(i, j) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return (h ^ (h >>> 16)) >>> 0
}

export default function GridBackground() {
  const canvasRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const layer = layerRef.current
    const ctx = canvas.getContext('2d')
    let offX = 0
    let offY = 0

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // A vertical line always passes through the horizontal centre of the page.
      offX = (w / 2) % CELL
      offY = NAV_HEIGHT % CELL
      const centerCol = Math.round((w / 2 - offX) / CELL)

      // Hatched cells
      ctx.save()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(141, 176, 255, 0.07)'
      for (let c = 0; offX + c * CELL < w; c++) {
        for (let r = 0; offY + r * CELL < h; r++) {
          if (hash(c - centerCol, r) % 13 !== 0) continue
          const x = offX + c * CELL
          const y = offY + r * CELL
          ctx.save()
          ctx.beginPath()
          ctx.rect(x + 1, y + 1, CELL - 1, CELL - 1)
          ctx.clip()
          ctx.beginPath()
          for (let d = -CELL; d < CELL * 2; d += 7) {
            ctx.moveTo(x + d, y + CELL)
            ctx.lineTo(x + d + CELL, y)
          }
          ctx.stroke()
          ctx.restore()
        }
      }
      ctx.restore()

      // Grid lines
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.beginPath()
      for (let x = offX; x <= w; x += CELL) {
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, h)
      }
      for (let y = offY; y <= h; y += CELL) {
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(w, Math.round(y) + 0.5)
      }
      ctx.stroke()

      // Intersection nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      for (let x = offX; x <= w; x += CELL) {
        for (let y = offY; y <= h; y += CELL) {
          ctx.beginPath()
          ctx.arc(Math.round(x) + 0.5, Math.round(y) + 0.5, 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    draw()
    window.addEventListener('resize', draw)

    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasMouse || prefersReducedMotion()) {
      return () => window.removeEventListener('resize', draw)
    }

    const cells = [...layer.children]
    let next = 0
    let current = null
    let lastKey = ''

    function onMove(e) {
      const col = Math.floor((e.clientX - offX) / CELL)
      const row = Math.floor((e.clientY - offY) / CELL)
      const key = `${col},${row}`
      if (key === lastKey) return
      lastKey = key

      if (current) gsap.to(current, { opacity: 0, duration: 1.5, ease: 'power2.out', overwrite: true })
      current = cells[next++ % cells.length]
      gsap.set(current, { x: offX + col * CELL + 1, y: offY + row * CELL + 1 })
      gsap.to(current, { opacity: 1, duration: 0.12, ease: 'none', overwrite: true })
    }

    function onLeave() {
      if (current) gsap.to(current, { opacity: 0, duration: 0.9, overwrite: true })
      current = null
      lastKey = ''
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('resize', draw)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(cells)
    }
  }, [])

  return (
    <div className="gridbg" aria-hidden="true">
      <canvas ref={canvasRef} className="gridbg__canvas" />
      <div ref={layerRef} className="gridbg__cells">
        {Array.from({ length: POOL_SIZE }, (_, i) => <span key={i} className="gridbg__cell" />)}
      </div>
    </div>
  )
}
