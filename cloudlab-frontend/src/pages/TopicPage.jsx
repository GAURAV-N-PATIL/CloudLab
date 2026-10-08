import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ExternalLink, FileText, LockOpen } from 'lucide-react'
import { animate, stagger } from 'animejs'
import { prefersReducedMotion } from '../lib/motion'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import { youtubePlaylistId, youtubeVideoId } from '../lib/youtube'
import StatusBadge from '../components/StatusBadge'
import { ErrorState, PageSkeleton } from '../components/States'

// Remount per topic so completion/unlock messages never carry over to another topic.
export default function TopicRoute() {
  const { slug } = useParams()
  return <TopicPage key={slug} slug={slug} />
}

function TopicPage({ slug }) {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getTopic(slug), api.getRoadmap()]),
    [slug],
  )
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [newlyUnlocked, setNewlyUnlocked] = useState([])

  if (loading && !data) return <PageSkeleton rows={3} />
  if (error) {
    const message = error.status === 403
      ? 'This topic belongs to the other cloud track.'
      : error.status === 404 ? 'We could not find that topic.' : undefined
    return <ErrorState error={message ? { message } : error} onRetry={reload} title="Could not open this topic" />
  }

  const [topic, roadmap] = data
  const canComplete = topic.status === 'UNLOCKED' || topic.status === 'IN_PROGRESS'

  async function handleComplete() {
    setSaving(true)
    setActionError('')
    const lockedBefore = new Set(roadmap.filter((t) => t.status === 'LOCKED').map((t) => t.slug))
    try {
      await api.completeTopic(topic.slug)
      const fresh = await api.getRoadmap()
      setNewlyUnlocked(fresh.filter((t) => lockedBefore.has(t.slug) && t.status === 'UNLOCKED'))
      reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const allDone = roadmap.every((t) => t.status === 'COMPLETED' || t.slug === topic.slug)

  return (
    <article className="topic">
      <Link to="/roadmap" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to roadmap</Link>

      <div className="meta-row">
        <span className="badge">{titleCase(topic.level)}</span>
        <StatusBadge status={topic.status} />
      </div>
      <h1>{topic.name}</h1>
      <p className="topic__lead">{topic.description}</p>

      <section aria-labelledby="resources-title" className="topic__resources">
        <h2 id="resources-title">Learning material</h2>
        {topic.resources.length === 0 ? (
          <p>No material has been added to this topic yet.</p>
        ) : (
          <ul className="resource-list">
            {topic.resources.map((r) => <Resource key={r.id} resource={r} />)}
          </ul>
        )}
      </section>

      <section className="topic__complete card card--flat" aria-live="polite">
        {topic.status === 'COMPLETED' ? (
          <p className="topic__done"><Check size={18} aria-hidden="true" /> You have completed this topic.</p>
        ) : (
          <>
            <p>Finished the material? Marking this complete opens the next topic.</p>
            <button type="button" className="btn btn--primary" onClick={handleComplete} disabled={!canComplete || saving}>
              {saving ? 'Saving…' : 'Mark as complete'}
            </button>
            {topic.status === 'LOCKED' && <p className="field__hint">Complete the previous topic first.</p>}
          </>
        )}
        {actionError && <div className="notice notice--error" role="alert"><p>{actionError}</p></div>}
      </section>

      {topic.status === 'COMPLETED' && newlyUnlocked.length > 0 && <UnlockPanel topics={newlyUnlocked} />}

      {topic.status === 'COMPLETED' && allDone && !newlyUnlocked.length && (
        <div className="notice"><p>You have finished everything available right now. <Link to="/roadmap">Back to the roadmap</Link> to continue.</p></div>
      )}
    </article>
  )
}

function Resource({ resource }) {
  const { type, title, url } = resource
  const videoId = type === 'YOUTUBE_VIDEO' ? youtubeVideoId(url) : null
  const playlistId = type === 'YOUTUBE_PLAYLIST' ? youtubePlaylistId(url) : null

  if (videoId || playlistId) {
    const src = videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`
    return (
      <li className="resource resource--video">
        <h3>{title}</h3>
        <div className="video-frame">
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </li>
    )
  }

  const Icon = type === 'PDF' ? FileText : ExternalLink
  const kind = { PDF: 'PDF', ARTICLE: 'Article', YOUTUBE_VIDEO: 'Video', YOUTUBE_PLAYLIST: 'Playlist' }[type] ?? 'Link'
  return (
    <li className="resource">
      <a href={url} target="_blank" rel="noopener noreferrer" className="resource__link">
        <Icon size={18} aria-hidden="true" />
        <span>
          <span className="resource__title">{title}</span>
          <span className="resource__kind">{kind}, opens in a new tab</span>
        </span>
      </a>
    </li>
  )
}

// Anime.js: when completing a topic opens the next one, the panel pops in and the new links follow.
function UnlockPanel({ topics }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const a = animate(el, { opacity: [0, 1], translateY: [14, 0], scale: [0.96, 1], duration: 650, ease: 'outBack' })
    const b = animate(el.querySelectorAll('.unlock-panel__icon'), { rotate: [-25, 0], scale: [0.4, 1], duration: 700, delay: 150, ease: 'outElastic(1, .6)' })
    const c = animate(el.querySelectorAll('.unlock-panel__link'), { opacity: [0, 1], translateX: [-10, 0], delay: stagger(90, { start: 250 }), duration: 500, ease: 'outExpo' })
    return () => { a.revert(); b.revert(); c.revert() }
  }, [])

  return (
    <section className="unlock-panel" aria-label="Newly unlocked" ref={ref}>
      <LockOpen className="unlock-panel__icon" size={22} aria-hidden="true" />
      <div>
        <strong>Unlocked:</strong>{' '}
        {topics.map((t, i) => (
          <span key={t.slug} className="unlock-panel__link">
            {i > 0 && ', '}
            <Link to={`/roadmap/${t.slug}`}>{t.name}</Link>
          </span>
        ))}
      </div>
    </section>
  )
}
