import { useId, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import CountUp from './CountUp'

// Circular progress. The arc draws itself once on mount (GSAP) and the number counts up.
export default function ProgressRing({ percent, size = 112, stroke = 9, label = 'Progress' }) {
  const value = Math.max(0, Math.min(100, percent))
  const gradientId = useId()
  const fillRef = useRef(null)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const target = circumference * (1 - value / 100)

  useLayoutEffect(() => {
    const el = fillRef.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.style.strokeDashoffset = target
      return
    }
    const tween = gsap.fromTo(el, { strokeDashoffset: circumference }, { strokeDashoffset: target, duration: 1.3, ease: 'power3.out' })
    return () => tween.kill()
  }, [circumference, target])

  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b93ff" />
            <stop offset="100%" stopColor={value === 100 ? '#3fd39a' : '#9fbcff'} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          ref={fillRef} cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring__value" aria-hidden="true"><CountUp value={value} suffix="%" /></span>
    </div>
  )
}
