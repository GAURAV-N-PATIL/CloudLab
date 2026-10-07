import { realApi } from './real'
import { mockApi } from './mock'

// VITE_USE_MOCK=true  -> Part A (no backend). Anything else -> real Spring Boot API.
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const api = useMock ? mockApi : realApi
export const isMockMode = useMock
export { ApiError, setUnauthorizedHandler } from './client'
