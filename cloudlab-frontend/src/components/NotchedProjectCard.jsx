import { useState } from 'react'
import { ArrowUpRight, Clock, FileText } from 'lucide-react'

// A card with a notched top-right corner, a rounded cover, optional monochrome cover,
// a title, a description and tags. One markup for both states:
//   available   -> a <button> that opens the viewer
//   unavailable -> a plain <div> with a "Coming soon" badge (not focusable, nothing opens)
export default function NotchedProjectCard({ resource, available, monochrome = true, onOpen }) {
  const { title, description, previewImage, coverText, tags = [], badge } = resource
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(previewImage) && !imageFailed

  const Tag = available ? 'button' : 'div'
  const interactive = available
    ? {
        type: 'button',
        'aria-haspopup': 'dialog',
        'aria-label': `${title}. ${description} Opens the document viewer.`,
        onClick: (e) => onOpen(resource, e.currentTarget),
      }
    : {}

  return (
    <Tag
      className={`ncard${available ? '' : ' is-unavailable'}${monochrome ? ' is-mono' : ''}`}
      {...interactive}
    >
      <span className="ncard__edge" aria-hidden="true" />

      <span className="ncard__notch" aria-hidden="true">
        {available ? <ArrowUpRight size={18} /> : <Clock size={16} />}
      </span>

      <span className="ncard__body">
        <span className="ncard__cover">
          {showImage ? (
            <img src={previewImage} alt="" loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <span className="ncard__placeholder" aria-hidden="true">
              {coverText ? <span className="ncard__placeholder-text">{coverText}</span> : <FileText size={34} />}
            </span>
          )}
          <span className="ncard__badges">
            {!available && <span className="ncard__badge ncard__badge--soon"><Clock size={12} aria-hidden="true" /> Coming soon</span>}
            {badge && <span className="ncard__badge">{badge}</span>}
          </span>
        </span>

        <span className="ncard__title">{title}</span>
        <span className="ncard__desc">{description}</span>

        {tags.length > 0 && (
          <span className="ncard__tags">
            {tags.map((t) => <span key={t} className="ncard__tag">{t}</span>)}
          </span>
        )}

        <span className="ncard__cta">
          {available ? (<><FileText size={15} aria-hidden="true" /> View PDF</>) : 'Not uploaded yet'}
        </span>
      </span>
    </Tag>
  )
}
