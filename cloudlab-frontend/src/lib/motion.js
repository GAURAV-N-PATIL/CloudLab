// Shared motion setup.
// Anime.js drives the roadmap timeline, the landing "how it works" row and the unlock moment.
// GSAP drives the hero, auth panel, pricing, footer and number count-ups.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
