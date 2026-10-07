import { Link } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import StatusBadge from './StatusBadge'

// One stop on the roadmap path. Locked stops are not links.
export default function PathNode({ topic }) {
  const locked = topic.status === 'LOCKED'
  const content = (
    <>
      <span className="path-node__marker" aria-hidden="true">
        {topic.status === 'COMPLETED' && <Check size={14} strokeWidth={3} />}
        {locked && <Lock size={12} />}
      </span>
      <span className="path-node__body">
        <span className="path-node__title">{topic.name}</span>
        <span className="path-node__desc">
          {locked ? 'Finish the previous topic to open this one.' : topic.description}
        </span>
      </span>
      <StatusBadge status={topic.status} />
    </>
  )

  return (
    <li className={`path-node path-node--${topic.status.toLowerCase()}`}>
      {locked ? (
        <div className="path-node__row" aria-disabled="true">{content}</div>
      ) : (
        <Link to={`/roadmap/${topic.slug}`} className="path-node__row">{content}</Link>
      )}
    </li>
  )
}
