import { Check, Lock, CircleDot, Play, Send } from 'lucide-react'
import { PROJECT_STATUS_LABEL, TOPIC_STATUS_LABEL } from '../lib/format'

const VARIANTS = {
  COMPLETED: { className: 'badge--done', Icon: Check },
  SUBMITTED: { className: 'badge--open', Icon: Send },
  IN_PROGRESS: { className: 'badge--open', Icon: CircleDot },
  UNLOCKED: { className: 'badge--open', Icon: Play },
  LOCKED: { className: 'badge--locked', Icon: Lock },
}

// kind: 'topic' | 'project'. Icon + text, so meaning never depends on color alone.
export default function StatusBadge({ status, kind = 'topic' }) {
  const variant = VARIANTS[status] ?? VARIANTS.LOCKED
  const labels = kind === 'project' ? PROJECT_STATUS_LABEL : TOPIC_STATUS_LABEL
  const { Icon } = variant
  return (
    <span className={`badge ${variant.className}`}>
      <Icon size={13} aria-hidden="true" />
      {labels[status] ?? status}
    </span>
  )
}
