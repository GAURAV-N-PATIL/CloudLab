import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { findNextTopic, summarizeProgress } from '../lib/format'
import ProgressBar from '../components/ProgressBar'
import { ErrorState, PageSkeleton } from '../components/States'

const PREVIEW_PATH = [
  { name: 'Linux', note: 'The command line you will work in every day' },
  { name: 'Networking', note: 'How machines find and talk to each other' },
  { name: 'Git & GitHub', note: 'Version control and collaboration' },
  { name: 'Docker', note: 'Package an app so it runs the same anywhere' },
  { name: 'CI/CD', note: 'Test and ship on every push' },
  { name: 'Kubernetes', note: 'Run containers at scale' },
  { name: 'Terraform', note: 'Describe infrastructure as code' },
  { name: 'AWS or Azure', note: 'Go deep on one cloud' },
]

const STEPS = [
  { title: 'Finish a topic', body: 'Each topic has curated videos and reading. Mark it complete when you are done.' },
  { title: 'The next one opens', body: 'Topics unlock in order, so you never wonder what to learn next.' },
  { title: 'Build a project', body: 'Projects unlock once you have covered what they need.' },
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated ? <Dashboard user={user} /> : <Landing />
}

function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__copy">
          <h1 className="hero__title">Learn cloud and DevOps in the order you will use it.</h1>
          <p className="hero__lead">
            One fixed path from Linux to Kubernetes and Terraform. Finish a topic to open the next,
            then build projects with what you learned.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn btn--primary btn--lg">Create a free account</Link>
            <Link to="/login" className="btn btn--secondary btn--lg">Log in</Link>
          </div>
          <p className="hero__fine">Beginner topics and two projects are free.</p>
        </div>

        {/* The one orchestrated motion on this page: the path fills in once on load. */}
        <ol className="preview-path" aria-label="The CloudLab learning path">
          {PREVIEW_PATH.map((item, i) => (
            <li key={item.name} className="preview-path__item" style={{ '--i': i }}>
              <span className="preview-path__dot" aria-hidden="true" />
              <span>
                <span className="preview-path__name">{item.name}</span>
                <span className="preview-path__note">{item.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="steps" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol className="steps__list">
          {STEPS.map((s, i) => (
            <li key={s.title} className="steps__item">
              <span className="steps__num" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function Dashboard({ user }) {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getRoadmap(), api.getProjects()]),
    [],
  )

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />

  const [topics, projects] = data
  const { completed, total, percent } = summarizeProgress(topics)
  const next = findNextTopic(topics)
  const readyProjects = projects.filter((p) => p.status === 'UNLOCKED' || p.status === 'IN_PROGRESS')
  const needsCloud = !user.selectedCloudSlug && total > 0 && completed === total
  const firstName = user.name.split(' ')[0]

  return (
    <div>
      <div className="page-head">
        <h1>Welcome back, {firstName}</h1>
        <p>
          {user.selectedCloudName
            ? `You are on the ${user.selectedCloudName} track.`
            : 'You are on the provider-neutral path.'}
        </p>
      </div>

      <div className="dash-grid">
        <section className="card" aria-labelledby="dash-progress">
          <h2 id="dash-progress">Your progress</h2>
          <ProgressBar percent={percent} label="Roadmap progress" detail={`${completed} of ${total} topics`} />
        </section>

        <section className="card" aria-labelledby="dash-next">
          <h2 id="dash-next">{needsCloud ? 'Next: choose a cloud' : 'Pick up where you left off'}</h2>
          {needsCloud ? (
            <>
              <p>You finished the neutral topics. Choose AWS or Azure to continue.</p>
              <Link to="/roadmap" className="btn btn--primary">Choose a cloud track</Link>
            </>
          ) : next ? (
            <>
              <p><strong>{next.name}</strong><br />{next.description}</p>
              <Link to={`/roadmap/${next.slug}`} className="btn btn--primary">Open topic</Link>
            </>
          ) : (
            <p>You have completed every topic available to you.</p>
          )}
        </section>

        <section className="card" aria-labelledby="dash-projects">
          <h2 id="dash-projects">Projects</h2>
          {readyProjects.length > 0 ? (
            <>
              <p>{readyProjects.length} {readyProjects.length === 1 ? 'project is' : 'projects are'} ready to build.</p>
              <Link to="/projects" className="btn btn--secondary">View projects</Link>
            </>
          ) : (
            <>
              <p>Projects open as you finish the topics they need.</p>
              <Link to="/projects" className="btn btn--secondary">View projects</Link>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
