import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { summarizeProgress, titleCase } from '../lib/format'
import ProgressBar from '../components/ProgressBar'
import PathNode from '../components/PathNode'
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
  const showCloudChoice = !user.selectedCloudSlug && completed === total
  const groups = LEVEL_ORDER
    .map((level) => ({ level, items: topics.filter((t) => t.level === level) }))
    .filter((g) => g.items.length > 0)

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

      <div className="card card--flat roadmap-summary">
        <ProgressBar percent={percent} label="Roadmap progress" detail={`${completed} of ${total} topics completed`} />
      </div>

      {showCloudChoice && <CloudChoice providers={providers} onChosen={refreshUser} />}

      {!user.selectedCloudSlug && !showCloudChoice && (
        <div className="notice roadmap-note">
          <p>After the last topic here you will choose AWS or Azure for the rest of the path.</p>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.level} className="path-group" aria-labelledby={`level-${group.level}`}>
          <h2 id={`level-${group.level}`}>{titleCase(group.level)}</h2>
          <ol className="path">
            {group.items.map((topic) => <PathNode key={topic.id} topic={topic} />)}
          </ol>
        </section>
      ))}
    </div>
  )
}
