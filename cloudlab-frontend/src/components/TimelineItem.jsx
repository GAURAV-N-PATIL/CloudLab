import { Link } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import StatusBadge from './StatusBadge'

// One stop on the roadmap timeline. Cards alternate sides on wide screens.
export default function TimelineItem({ topic, side, isNext }) {
  const locked = topic.status === 'LOCKED'
  const body = (
    <>
      <span className="tl-card__top">
        <StatusBadge status={topic.status} />
        {isNext && <span className="tl-card__next">Up next</span>}
      </span>
      <span className="tl-card__title">{topic.name}</span>
      <span className="tl-card__desc">
        {locked ? 'Finish the previous topic to open this one.' : topic.description}
      </span>
    </>
  )

  return (
    <li className={`tl-item tl-item--${side} tl-item--${topic.status.toLowerCase()}${isNext ? ' tl-item--next' : ''}`}>
      <span className="tl-marker" aria-hidden="true">
        <span className="tl-dot">
          {topic.status === 'COMPLETED' && <Check size={14} strokeWidth={3} />}
          {locked && <Lock size={11} />}
        </span>
      </span>
      {locked ? (
        <div className="tl-card" aria-disabled="true">{body}</div>
      ) : (
        <Link to={`/roadmap/${topic.slug}`} className="tl-card">{body}</Link>
      )}
    </li>
  )
}
