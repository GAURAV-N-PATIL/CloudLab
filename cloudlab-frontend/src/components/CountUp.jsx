import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

// Tweens a number from 0 to `value` once on mount, then follows later changes.
export default function CountUp({ value, suffix = '', duration = 0.9 }) {
  const ref = useRef(null)
  const shown = useRef(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      shown.current = value
      el.textContent = `${value}${suffix}`
      return
    }
    const state = { n: shown.current }
    const tween = gsap.to(state, {
      n: value, duration, ease: 'power2.out',
      onUpdate: () => {
        shown.current = state.n
        el.textContent = `${Math.round(state.n)}${suffix}`
      },
    })
    return () => tween.kill()
  }, [value, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}
