import { useState } from 'react'
import { api } from '../api'

// Shown on the roadmap once the provider-neutral topics are done and no cloud is chosen yet.
// The server enforces "one choice, permanent" (409 if already set); this UI just makes it hard to do by accident.
export default function CloudChoice({ providers, onChosen }) {
  const [selectedId, setSelectedId] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selected = providers.find((p) => p.id === selectedId)

  async function lockIn() {
    setSaving(true)
    setError('')
    try {
      await api.selectCloud(selected.id)
      await onChosen()
    } catch (err) {
      setError(err.status === 409 ? 'A cloud track is already chosen for this account.' : err.message)
      setConfirming(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card cloud-choice" aria-labelledby="cloud-choice-title">
      <h2 id="cloud-choice-title">Choose your cloud track</h2>
      <p>
        You finished the provider-neutral topics. The rest of the path covers one cloud in depth.
        This choice is permanent, so pick the one you want on your resume.
      </p>

      <fieldset className="cloud-choice__options" disabled={saving}>
        <legend className="visually-hidden">Cloud provider</legend>
        {providers.map((p) => (
          <label key={p.id} className={`cloud-option${selectedId === p.id ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name="cloud"
              value={p.id}
              checked={selectedId === p.id}
              onChange={() => { setSelectedId(p.id); setConfirming(false) }}
            />
            <span className="cloud-option__name">{p.name}</span>
            <span className="cloud-option__desc">{p.description}</span>
          </label>
        ))}
      </fieldset>

      {error && <div className="notice notice--error" role="alert"><p>{error}</p></div>}

      {!confirming ? (
        <button
          type="button"
          className="btn btn--primary"
          disabled={!selected}
          onClick={() => setConfirming(true)}
        >
          {selected ? `Continue with ${selected.name}` : 'Select a provider'}
        </button>
      ) : (
        <div className="cloud-choice__confirm" role="alertdialog" aria-label="Confirm cloud choice">
          <p><strong>Lock in {selected.name}?</strong> You will not be able to switch to the other track later.</p>
          <div className="cloud-choice__actions">
            <button type="button" className="btn btn--primary" onClick={lockIn} disabled={saving}>
              {saving ? 'Saving…' : `Yes, lock in ${selected.name}`}
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)} disabled={saving}>
              Go back
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
