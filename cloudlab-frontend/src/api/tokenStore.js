// JWT storage. localStorage keeps the user signed in across reloads.
// Trade-off: any XSS bug could read it. Acceptable for this project; note it in the report.
const KEY = 'cloudlab.token'

export const tokenStore = {
  get() {
    try { return localStorage.getItem(KEY) } catch { return null }
  },
  set(token) {
    try { localStorage.setItem(KEY, token) } catch { /* storage unavailable */ }
  },
  clear() {
    try { localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
  },
}
