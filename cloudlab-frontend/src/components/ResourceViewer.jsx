import { useEffect, useRef, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { driveViewUrl, drivePreviewUrl } from '../lib/drive'

// Modal PDF viewer built on the native <dialog> element: it traps focus, closes on Escape,
// makes the page behind it inert, and hands focus back to whatever opened it.
// The iframe is only rendered while the dialog is open and only when the file ID is valid.
export default function ResourceViewer({ resource, onClose }) {
  const dialogRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const src = resource ? drivePreviewUrl(resource.googleDriveFileId) : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (resource && !dialog.open) {
      setLoaded(false)
      dialog.showModal()
    } else if (!resource && dialog.open) {
      dialog.close()
    }
  }, [resource])

  // Stop the page scrolling behind the dialog.
  useEffect(() => {
    if (!resource) return
    document.documentElement.classList.add('is-modal-open')
    return () => document.documentElement.classList.remove('is-modal-open')
  }, [resource])

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-labelledby="viewer-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close() }}
    >
      {resource && (
        <div className="viewer__panel">
          <header className="viewer__head">
            <h2 id="viewer-title">{resource.title}</h2>
            {src && (
              <a className="viewer__open" href={driveViewUrl(resource.googleDriveFileId)} target="_blank" rel="noopener noreferrer">
                Open in Drive <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
            <button type="button" className="viewer__close" onClick={() => dialogRef.current.close()} aria-label="Close viewer" autoFocus>
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="viewer__body">
            {src ? (
              <>
                {!loaded && <div className="viewer__loading" role="status">Loading document…</div>}
                <iframe
                  key={src}
                  src={src}
                  title={resource.title}
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                  className={loaded ? 'is-loaded' : ''}
                />
              </>
            ) : (
              <div className="viewer__empty" role="status">
                <strong>This document is not available yet.</strong>
                <p>It will open here as soon as the PDF is added.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
