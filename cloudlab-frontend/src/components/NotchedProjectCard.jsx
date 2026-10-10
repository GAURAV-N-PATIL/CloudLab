import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Clock, FileText } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/motion'

// A card with a notched top-right corner, a rounded cover, optional monochrome cover,
// a title, a description and tags. One markup for both states:
//   available   -> a <button> that opens the viewer
//   unavailable -> a plain <div> with a "Coming soon" badge (not focusable, nothing opens)
export default function NotchedProjectCard({ resource, available, monochrome = true, onOpen }) {
  const { title, description, previewImage, coverText, tags = [], badge } = resource
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(previewImage) && !imageFailed
  const ref = useRef(null)

  // Tilt toward the cursor (same feel as the Projects page cards). Only for cards that open a PDF,
  // and skipped on touch devices and for "reduce motion".
  useEffect(() => {
    const el = ref.current
    if (!el || !available || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    el.classList.add('is-tilt')
    const max = 7
    const lift = -4
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
      moveY(py * 10 + lift)
      el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
    }
    function onLeave() { rotX(0); rotY(0); moveX(0); moveY(0) }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
      el.classList.remove('is-tilt')
    }
  }, [available])

  const Tag = available ? 'button' : 'div'
  const interactive = available
    ? {
        type: 'button',
        'aria-haspopup': 'dialog',
        'aria-label': `${title}. ${description} Opens the document viewer.`,
        onClick: (e) => onOpen(resource, e.currentTarget),
      }
    : {}

  return (
    <Tag
      ref={ref}
      className={`ncard${available ? '' : ' is-unavailable'}${monochrome ? ' is-mono' : ''}`}
      {...interactive}
    >
      <span className="ncard__edge" aria-hidden="true" />

      <span className="ncard__notch" aria-hidden="true">
        {available ? <ArrowUpRight size={18} /> : <Clock size={16} />}
      </span>

      <span className="ncard__body">
        <span className="ncard__glare" aria-hidden="true" />
        <span className="ncard__cover">
          {showImage ? (
            <img src={previewImage} alt="" loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <span className="ncard__placeholder" aria-hidden="true">
              {coverText ? <span className="ncard__placeholder-text">{coverText}</span> : <FileText size={34} />}
            </span>
          )}
          <span className="ncard__badges">
            {!available && <span className="ncard__badge ncard__badge--soon"><Clock size={12} aria-hidden="true" /> Coming soon</span>}
            {badge && <span className="ncard__badge">{badge}</span>}
          </span>
        </span>

        <span className="ncard__title">{title}</span>
        <span className="ncard__desc">{description}</span>

        {tags.length > 0 && (
          <span className="ncard__tags">
            {tags.map((t) => <span key={t} className="ncard__tag">{t}</span>)}
          </span>
        )}

        <span className="ncard__cta">
          {available ? (<><FileText size={15} aria-hidden="true" /> View PDF</>) : 'Not uploaded yet'}
        </span>
      </span>
    </Tag>
  )
}
