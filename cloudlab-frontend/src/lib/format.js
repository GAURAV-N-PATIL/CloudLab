export function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function titleCase(value) {
  if (!value) return ''
  return value.charAt(0) + value.slice(1).toLowerCase()
}

// Backend statuses -> what the learner reads.
export const TOPIC_STATUS_LABEL = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
  UNLOCKED: 'Ready to start',
  LOCKED: 'Locked',
}

export const PROJECT_STATUS_LABEL = {
  COMPLETED: 'Completed',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In progress',
  UNLOCKED: 'Ready to start',
  LOCKED: 'Locked',
}

export function summarizeProgress(topics) {
  const total = topics.length
  const completed = topics.filter((t) => t.status === 'COMPLETED').length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, percent }
}

// First topic the learner can act on, in roadmap order.
export function findNextTopic(topics) {
  return (
    topics.find((t) => t.status === 'IN_PROGRESS') ??
    topics.find((t) => t.status === 'UNLOCKED') ??
    null
  )
}
