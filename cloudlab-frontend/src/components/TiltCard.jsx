import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../lib/motion'

// A card that tilts toward the cursor and drifts slightly with it (GSAP quickTo).
// Children marked with .z1 / .z2 / .z3 sit at different depths, so they shift against each
// other as the card turns. Disabled on touch devices and for "reduce motion".
export default function TiltCard({ to, className = '', children, max = 7, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' })
    const opts = { duration: 0.5, ease: 'power3.out' }
    const rotX = gsap.quickTo(el, 'rotationX', opts)
    const rotY = gsap.quickTo(el, 'rotationY', opts)
    const moveX = gsap.quickTo(el, 'x', opts)
    const moveY = gsap.quickTo(el, 'y', opts)

    function onMove(e) {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rotY(px * max * 2)
      rotX(-py * max * 2)
      moveX(px * 10)
      moveY(py * 10)
      el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
    }
    function onLeave() {
      rotX(0); rotY(0); moveX(0); moveY(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [max])

  const Tag = to ? Link : 'div'
  return (
    <Tag ref={ref} to={to} className={`tilt ${className}`} {...rest}>
      <span className="tilt__glare" aria-hidden="true" />
      {children}
    </Tag>
  )
}
