import { useCallback, useEffect, useState } from 'react'

// Runs an async loader on mount and whenever `deps` change.
// Returns { data, error, loading, reload }.
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loader()
      .then((data) => { if (!cancelled) setState({ data, error: null, loading: false }) })
      .catch((error) => { if (!cancelled) setState({ data: null, error, loading: false }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
