import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { isResourceAvailable } from '../lib/drive'
import resourceData from '../data/resources.json'
import NotchedProjectCard from '../components/NotchedProjectCard'
import ResourceViewer from '../components/ResourceViewer'
import { EmptyState } from '../components/States'

// Public page ("Assignments & Experiment"). Everything shown here comes from
// src/data/resources.json, so adding or changing a document never touches this file.
export default function ExplorePage() {
  const sections = useMemo(
    () => (Array.isArray(resourceData?.sections) ? resourceData.sections.filter((s) => s.resources?.length) : []),
    [],
  )
  const [active, setActive] = useState(null)
  const triggerRef = useRef(null)
  const pageRef = useRef(null)

  const all = sections.flatMap((s) => s.resources)
  const availableCount = all.filter(isResourceAvailable).length

  function openViewer(resource, triggerEl) {
    if (!isResourceAvailable(resource)) return
    triggerRef.current = triggerEl
    setActive(resource)
  }

  function closeViewer() {
    setActive(null)
    // Return focus to the card that opened the viewer.
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  // GSAP: each section's cards rise in, staggered, the first time the section scrolls into view.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || sections.length === 0) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.rl-grid').forEach((grid) => {
        gsap.from(grid.children, {
          y: 36, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity',
          scrollTrigger: { trigger: grid, start: 'top 88%', once: true },
        })
      })
      gsap.from('.rl-head > *', { y: 22, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, pageRef)
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => { clearTimeout(t); ctx.revert() }
  }, [sections])

  if (sections.length === 0) {
    return <EmptyState title="Nothing here yet">No documents have been added.</EmptyState>
  }

  return (
    <div className="rl" ref={pageRef}>
      <header className="rl-head">
        <Link to="/home" className="btn btn--secondary rl-back">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Home
        </Link>
        <h1>Assignments &amp; Experiment</h1>
        <p>
          Experiments, assignments and tutorials, plus each team member&apos;s certificate and index.
          Open a card to read the PDF here.
        </p>
        <p className="rl-head__count" role="status">{availableCount} of {all.length} documents available</p>
        <nav className="rl-jump" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="chip">
              {s.title} <span className="chip__count">{s.resources.length}</span>
            </a>
          ))}
        </nav>
      </header>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="rl-section" aria-labelledby={`${section.id}-title`}>
          <div className="rl-section__head">
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.description && <p>{section.description}</p>}
          </div>
          <ul className="rl-grid">
            {section.resources.map((resource) => (
              <li key={resource.id}>
                <NotchedProjectCard
                  resource={resource}
                  available={isResourceAvailable(resource)}
                  onOpen={openViewer}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <ResourceViewer resource={active} onClose={closeViewer} />
    </div>
  )
}
