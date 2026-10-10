import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, createScope, onScroll } from 'animejs'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { findNextTopic, summarizeProgress, titleCase } from '../lib/format'
import { prefersReducedMotion } from '../lib/motion'
import ProgressRing from '../components/ProgressRing'
import StatusBadge from '../components/StatusBadge'
import TimelineItem from '../components/TimelineItem'
import CloudChoice from '../components/CloudChoice'
import { ErrorState, PageSkeleton, EmptyState } from '../components/States'

const LEVEL_ORDER = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function RoadmapPage() {
  const { user, refreshUser } = useAuth()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getRoadmap(), api.getCloudProviders()]),
    [user.selectedCloudSlug],
  )

  if (loading) return <PageSkeleton rows={5} />
  if (error) return <ErrorState error={error} onRetry={reload} />

  const [topics, providers] = data
  if (topics.length === 0) {
    return <EmptyState title="No topics yet">The roadmap is empty. Check back soon.</EmptyState>
  }

  const { completed, total, percent } = summarizeProgress(topics)
  const next = findNextTopic(topics)
  const showCloudChoice = !user.selectedCloudSlug && completed === total
  const groups = LEVEL_ORDER
    .map((level) => ({ level, items: topics.filter((t) => t.level === level) }))
    .filter((g) => g.items.length > 0)

  const counts = {
    COMPLETED: topics.filter((t) => t.status === 'COMPLETED').length,
    OPEN: topics.filter((t) => t.status === 'UNLOCKED' || t.status === 'IN_PROGRESS').length,
    LOCKED: topics.filter((t) => t.status === 'LOCKED').length,
  }

  function jumpToNext() {
    document.getElementById(`topic-${next.slug}`)?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center',
    })
  }

  // Alternate sides across the whole timeline, not per group.
  let index = 0

  return (
    <div>
      <div className="page-head">
        <h1>Roadmap</h1>
        <p>
          {user.selectedCloudName
            ? `Provider-neutral topics, then the ${user.selectedCloudName} track.`
            : 'Complete these in order. Each topic opens the next.'}
        </p>
      </div>

      <section className="rm-summary panel" aria-label="Roadmap summary">
        <ProgressRing percent={percent} label="Roadmap progress" size={104} />
        <div className="rm-summary__body">
          <strong className="rm-summary__count">{completed} of {total} topics completed</strong>
          <ul className="rm-legend" aria-label="Topic counts">
            <li><StatusBadge status="COMPLETED" /> <span>{counts.COMPLETED}</span></li>
            <li><StatusBadge status="UNLOCKED" /> <span>{counts.OPEN}</span></li>
            <li><StatusBadge status="LOCKED" /> <span>{counts.LOCKED}</span></li>
          </ul>
        </div>
        {next && (
          <div className="rm-summary__actions">
            <Link to={`/roadmap/${next.slug}`} className="btn btn--primary">Continue: {next.name}</Link>
            <button type="button" className="btn btn--ghost" onClick={jumpToNext}>Jump to it on the path</button>
          </div>
        )}
      </section>

      {showCloudChoice && <CloudChoice providers={providers} onChosen={refreshUser} />}

      {!user.selectedCloudSlug && !showCloudChoice && (
        <div className="notice roadmap-note">
          <p>After the last topic here you will choose AWS or Azure for the rest of the path.</p>
        </div>
      )}

      <Timeline>
        {groups.map((group) => (
          <li key={group.level} className="tl-group">
            <span className="tl-level">{titleCase(group.level)} <em>{group.items.filter((t) => t.status === 'COMPLETED').length}/{group.items.length}</em></span>
            <ol className="tl-group__list">
              {group.items.map((topic) => {
                const n = index++
                return (
                  <TimelineItem
                    key={topic.id}
                    topic={topic}
                    number={n + 1}
                    side={n % 2 === 0 ? 'left' : 'right'}
                    isNext={next?.slug === topic.slug}
                  />
                )
              })}
            </ol>
          </li>
        ))}
      </Timeline>
    </div>
  )
}

// Anime.js scroll timeline (thresholds read "viewport line, target edge"): the spine fills as you scroll, markers light up as the fill
// reaches them, and each card slides in from its side the first time it enters the viewport.
function Timeline({ children }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const markers = [...root.querySelectorAll('.tl-marker')]

    if (prefersReducedMotion()) {
      markers.forEach((m) => m.classList.add('is-reached'))
      root.querySelector('.tl-fill').style.transform = 'scaleY(1)'
      return
    }

    const scope = createScope({ root }).add(() => {
      // Where each marker sits along the spine, as a 0..1 fraction of the timeline height.
      let centers = []
      const measure = () => {
        const box = root.getBoundingClientRect()
        centers = markers.map((m) => {
          const r = m.getBoundingClientRect()
          return (r.top + r.height / 2 - box.top) / box.height
        })
      }
      measure()
      const reached = new Set()

      const light = (progress) => {
        markers.forEach((m, i) => {
          const hit = progress >= centers[i]
          if (hit && !reached.has(i)) {
            reached.add(i)
            m.classList.add('is-reached')
            animate(m.querySelector('.tl-dot'), {
              scale: [0.55, 1.22, 1],
              duration: 560,
              ease: 'outBack',
            })
          } else if (!hit && reached.has(i)) {
            reached.delete(i)
            m.classList.remove('is-reached')
          }
        })
      }

      animate('.tl-fill', {
        scaleY: [0, 1],
        ease: 'linear',
        autoplay: onScroll({
          target: root,
          enter: '62% top',
          leave: '62% bottom',
          sync: true,
          onUpdate: (self) => light(self.progress),
          onResize: measure,
        }),
      })

      root.querySelectorAll('.tl-item').forEach((item) => {
        const fromLeft = item.classList.contains('tl-item--left')
        const compact = window.matchMedia('(max-width: 760px)').matches
        const dx = compact ? 28 : fromLeft ? -56 : 56
        animate(item.querySelector('.tl-card'), {
          opacity: [0, 1],
          translateX: [dx, 0],
          translateY: [14, 0],
          duration: 800,
          ease: 'outExpo',
          autoplay: onScroll({ target: item, enter: '92% top', repeat: false }),
        })
      })

      animate('.tl-level', {
        opacity: [0, 1],
        scale: [0.88, 1],
        duration: 600,
        ease: 'outExpo',
        autoplay: onScroll({ target: root, enter: '88% top', repeat: false }),
      })
    })

    return () => scope.revert()
  })

  return (
    <div className="timeline" ref={rootRef}>
      <div className="tl-spine" aria-hidden="true"><div className="tl-fill" /></div>
      <ol className="tl-list">{children}</ol>
    </div>
  )
}
