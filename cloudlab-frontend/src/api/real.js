// Real API: one function per Spring Boot endpoint.
// Keep the names and return shapes identical to mock.js so the swap is a flag, not a rewrite.
import { request } from './client'

export const realApi = {
  // Auth (public). Both return { token }.
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  signup: (name, email, password) =>
    request('/auth/signup', { method: 'POST', body: { name, email, password } }),

  // Current user. { id, name, email, role, emailVerified, selectedCloudSlug, selectedCloudName }
  getMe: () => request('/users/me'),
  selectCloud: (cloudProviderId) =>
    request('/users/select-cloud', { method: 'POST', body: { cloudProviderId } }),

  // [{ id, name, slug, description }]
  getCloudProviders: () => request('/cloud-providers'),

  // Roadmap. status: LOCKED | UNLOCKED | IN_PROGRESS | COMPLETED
  getRoadmap: () => request('/roadmap'),
  getTopic: (slug) => request(`/roadmap/${encodeURIComponent(slug)}`),
  completeTopic: (slug) => request(`/roadmap/${encodeURIComponent(slug)}/complete`, { method: 'POST' }),

  // Projects. status: LOCKED | UNLOCKED | IN_PROGRESS | SUBMITTED | COMPLETED
  getProjects: () => request('/projects'),
  getProject: (slug) => request(`/projects/${encodeURIComponent(slug)}`),
  submitProject: (slug) => request(`/projects/${encodeURIComponent(slug)}/submit`, { method: 'POST' }),

  // [{ id, certificateCode, issuedAt, pdfUrl }]
  getCertificates: () => request('/certificates'),

  // [{ id, plan, status, startedAt, expiresAt }]; active one is null when there is none (204).
  getSubscriptions: () => request('/subscriptions'),
  getActiveSubscription: () => request('/subscriptions/active'),

  // No backend endpoint yet (Phase 4). Fails clearly instead of pretending.
  subscribe: async () => {
    throw new Error('Payments are not available yet.')
  },
}
