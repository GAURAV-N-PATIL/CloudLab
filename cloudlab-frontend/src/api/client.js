import { tokenStore } from './tokenStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// AuthContext registers a callback here so a 401 anywhere signs the user out.
let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check that the backend is running.')
  }

  // The backend returns 204 with no body for complete/submit, and for "no active subscription".
  if (response.status === 204) return null

  if (!response.ok) {
    // Login and signup use 401/409 to mean "wrong credentials"/"already exists",
    // so only treat 401 as an expired session when we were sending a token.
    if (response.status === 401 && token && !path.startsWith('/auth/')) {
      onUnauthorized?.()
    }
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    return data.message || data.error || `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}
