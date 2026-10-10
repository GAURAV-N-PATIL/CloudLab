import { realApi } from './real'
import { mockApi } from './mock'

// Mock API is the DEFAULT, so a deploy without a backend (e.g. Vercel) just works.
// Only VITE_USE_MOCK=false switches to the real Spring Boot API.
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export const api = useMock ? mockApi : realApi
export const isMockMode = useMock
export { ApiError, setUnauthorizedHandler } from './client'
