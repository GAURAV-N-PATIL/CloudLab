// Part A: an in-browser fake of the Spring Boot API.
// It reproduces the server's rules (statuses, provider fork, 409 on re-selecting a cloud)
// and keeps state in localStorage so progress survives a refresh.
// Demo login: demo@cloudlab.dev / password123
import { ApiError } from './client'
import { tokenStore } from './tokenStore'
import { cloudProviders, topics, projects } from './mockData'

const DB_KEY = 'cloudlab.mockdb'
const LATENCY_MS = 180

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)))

function freshDb() {
  return {
    nextUserId: 2,
    users: {
      'demo@cloudlab.dev': {
        id: 1, name: 'Demo Learner', email: 'demo@cloudlab.dev', password: 'password123',
        role: 'USER', emailVerified: true, selectedCloudSlug: null,
        topicProgress: { 'linux-fundamentals': 'COMPLETED', 'linux-file-system': 'COMPLETED' },
        projectProgress: {}, subscriptions: [], certificates: [],
      },
    },
  }
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* fall through to fresh data */ }
  const db = freshDb()
  saveDb(db)
  return db
}

function saveDb(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)) } catch { /* storage unavailable */ }
}

// The token is "mock.<email>"; the real one is a JWT whose subject is the email.
function currentUser(db) {
  const token = tokenStore.get()
  const email = token?.startsWith('mock.') ? token.slice(5) : null
  const user = email ? db.users[email] : null
  if (!user) throw new ApiError(401, 'Not signed in')
  return user
}

const providerBySlug = (slug) => cloudProviders.find((p) => p.slug === slug)

// Same rule as RoadmapService: neutral topics always; provider topics only for the chosen cloud.
function availableTopics(user) {
  return topics
    .filter((t) => t.cloud === null || t.cloud === user.selectedCloudSlug)
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

function topicStatus(topic, user) {
  if (user.topicProgress[topic.slug] === 'COMPLETED') return 'COMPLETED'
  if (user.topicProgress[topic.slug] === 'IN_PROGRESS') return 'IN_PROGRESS'
  if (!topic.prerequisite || user.topicProgress[topic.prerequisite] === 'COMPLETED') return 'UNLOCKED'
  return 'LOCKED'
}

function projectUnlocked(project, user) {
  if (project.free) return true
  return project.requires.every((slug) => user.topicProgress[slug] === 'COMPLETED')
}

function projectStatus(project, user) {
  const saved = user.projectProgress[project.slug]
  if (saved) return saved
  return projectUnlocked(project, user) ? 'UNLOCKED' : 'LOCKED'
}

function availableProjects(user) {
  return projects
    .filter((p) => p.cloud === null || p.cloud === user.selectedCloudSlug)
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

function issueCertificateIfEarned(db, user) {
  const list = availableTopics(user)
  const finished = list.length > 0 && list.every((t) => user.topicProgress[t.slug] === 'COMPLETED')
  if (finished && user.selectedCloudSlug && user.certificates.length === 0) {
    user.certificates.push({
      id: user.certificates.length + 1,
      certificateCode: `CL-${Date.now().toString(36).toUpperCase()}`,
      issuedAt: new Date().toISOString(),
      pdfUrl: null,
    })
  }
}

const toUserResponse = (user) => ({
  id: user.id, name: user.name, email: user.email, role: user.role,
  emailVerified: user.emailVerified,
  selectedCloudSlug: user.selectedCloudSlug,
  selectedCloudName: providerBySlug(user.selectedCloudSlug)?.name ?? null,
})

const toResource = ({ id, type, title, url, orderIndex }) => ({ id, type, title, url, orderIndex })

export const mockApi = {
  async login(email, password) {
    const db = loadDb()
    const key = email.trim().toLowerCase()
    const user = db.users[key === 'demo' ? 'demo@cloudlab.dev' : key]
    if (!user || user.password !== password) throw new ApiError(401, 'Invalid email or password')
    return wait({ token: `mock.${user.email}` })
  },

  async signup(name, email, password) {
    const db = loadDb()
    const key = email.trim().toLowerCase()
    if (db.users[key]) throw new ApiError(409, 'An account with this email already exists')
    db.users[key] = {
      id: db.nextUserId++, name: name.trim(), email: key, password,
      role: 'USER', emailVerified: false, selectedCloudSlug: null,
      topicProgress: {}, projectProgress: {}, subscriptions: [], certificates: [],
    }
    saveDb(db)
    return wait({ token: `mock.${key}` })
  },

  async getMe() {
    return wait(toUserResponse(currentUser(loadDb())))
  },

  async selectCloud(cloudProviderId) {
    const db = loadDb()
    const user = currentUser(db)
    if (user.selectedCloudSlug) throw new ApiError(409, 'Cloud provider already selected')
    const provider = cloudProviders.find((p) => p.id === cloudProviderId)
    if (!provider) throw new ApiError(404, 'Cloud provider not found')
    user.selectedCloudSlug = provider.slug
    saveDb(db)
    return wait(null)
  },

  async getCloudProviders() {
    return wait(clone(cloudProviders))
  },

  async getRoadmap() {
    const user = currentUser(loadDb())
    return wait(availableTopics(user).map((t) => ({
      id: t.id, name: t.name, slug: t.slug, level: t.level,
      orderIndex: t.orderIndex, description: t.description, status: topicStatus(t, user),
    })))
  },

  async getTopic(slug) {
    const user = currentUser(loadDb())
    const topic = availableTopics(user).find((t) => t.slug === slug)
    if (!topic) throw new ApiError(404, 'Topic not found')
    return wait({
      id: topic.id, name: topic.name, slug: topic.slug, level: topic.level,
      orderIndex: topic.orderIndex, description: topic.description,
      status: topicStatus(topic, user),
      prerequisiteSlug: topic.prerequisite,
      resources: topic.resources.map(toResource),
    })
  },

  async completeTopic(slug) {
    const db = loadDb()
    const user = currentUser(db)
    const topic = availableTopics(user).find((t) => t.slug === slug)
    if (!topic) throw new ApiError(404, 'Topic not found')
    if (topicStatus(topic, user) === 'LOCKED') throw new ApiError(409, 'Topic is locked')
    user.topicProgress[slug] = 'COMPLETED'
    issueCertificateIfEarned(db, user)
    saveDb(db)
    return wait(null)
  },

  async getProjects() {
    const user = currentUser(loadDb())
    return wait(availableProjects(user).map((p) => ({
      id: p.id, title: p.title, slug: p.slug, level: p.level,
      orderIndex: p.orderIndex, free: p.free, status: projectStatus(p, user),
    })))
  },

  async getProject(slug) {
    const user = currentUser(loadDb())
    const project = availableProjects(user).find((p) => p.slug === slug)
    if (!project) throw new ApiError(404, 'Project not found')
    return wait({
      id: project.id, title: project.title, slug: project.slug, level: project.level,
      orderIndex: project.orderIndex, description: project.description, free: project.free,
      status: projectStatus(project, user),
      requiredTopicSlugs: [...project.requires],
      resources: project.resources.map(toResource),
    })
  },

  async submitProject(slug) {
    const db = loadDb()
    const user = currentUser(db)
    const project = availableProjects(user).find((p) => p.slug === slug)
    if (!project) throw new ApiError(404, 'Project not found')
    if (!projectUnlocked(project, user)) throw new ApiError(409, 'Project is locked')
    user.projectProgress[slug] = 'SUBMITTED'
    saveDb(db)
    return wait(null)
  },

  async getCertificates() {
    return wait(clone(currentUser(loadDb()).certificates))
  },

  async getSubscriptions() {
    return wait(clone(currentUser(loadDb()).subscriptions))
  },

  async getActiveSubscription() {
    const active = currentUser(loadDb()).subscriptions.find((s) => s.status === 'ACTIVE')
    return wait(active ? clone(active) : null)
  },

  // Mock-only stand-in for Phase 4 checkout so the Pricing flow can be demoed.
  async subscribe(plan) {
    const db = loadDb()
    const user = currentUser(db)
    const startedAt = new Date()
    const days = { MONTHLY: 30, YEARLY: 365, LIFETIME: null }[plan]
    user.subscriptions.forEach((s) => { if (s.status === 'ACTIVE') s.status = 'CANCELLED' })
    user.subscriptions.push({
      id: user.subscriptions.length + 1, plan, status: 'ACTIVE',
      startedAt: startedAt.toISOString(),
      expiresAt: days ? new Date(startedAt.getTime() + days * 86400000).toISOString() : null,
    })
    saveDb(db)
    return wait(null)
  },
}
