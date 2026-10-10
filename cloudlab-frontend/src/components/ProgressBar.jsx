export default function ProgressBar({ percent, label, detail }) {
  const value = Math.max(0, Math.min(100, percent))
  return (
    <div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
      >
        <div
          className={`progress__fill${value === 100 ? ' progress__fill--done' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {detail && (
        <div className="progress-meta">
          <span>{detail}</span>
          <span>{value}%</span>
        </div>
      )}
    </div>
  )
}
