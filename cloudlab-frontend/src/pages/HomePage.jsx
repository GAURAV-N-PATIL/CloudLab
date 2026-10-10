import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, createScope, onScroll, stagger } from 'animejs'
import { useAuth } from '../context/AuthContext'
import { gsap, prefersReducedMotion } from '../lib/motion'
import Dashboard from '../components/Dashboard'
import SplitWords from '../components/SplitWords'

const PREVIEW_PATH = [
  { name: 'Linux', note: 'The command line you will use every day' },
  { name: 'Networking', note: 'How machines find and talk to each other' },
  { name: 'Git & GitHub', note: 'Version control and collaboration' },
  { name: 'Docker', note: 'Package an app so it runs anywhere' },
  { name: 'CI/CD', note: 'Test and ship on every push' },
  { name: 'Kubernetes', note: 'Run containers at scale' },
  { name: 'Terraform', note: 'Describe infrastructure as code' },
  { name: 'AWS or Azure', note: 'Go deep on one cloud' },
]

const STEPS = [
  { title: 'Finish a topic', body: 'Each topic has curated videos and reading. Mark it complete when you are done.' },
  { title: 'The next one opens', body: 'Topics unlock in order, so you never wonder what to learn next.' },
  { title: 'Build a project', body: 'Projects unlock once you have covered what they need.' },
]

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated ? <Dashboard user={user} /> : <Landing />
}

function Landing() {
  const heroRef = useRef(null)
  const stepsRef = useRef(null)

  // GSAP: the one orchestrated moment. Headline words rise, then the path card draws itself.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero__eyebrow', { y: 14, opacity: 0, duration: 0.6 })
        .from('.split-word__inner', { yPercent: 115, duration: 0.95, stagger: 0.07, ease: 'power4.out' }, 0.1)
        .from('.hero__lead, .hero__actions, .hero__fine', { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.45')
        .from('.hero-card', { opacity: 0, y: 28, scale: 0.97, duration: 0.9 }, 0.25)
        .from('.pp__spine', { scaleY: 0, transformOrigin: 'top center', duration: 1.3, ease: 'power2.inOut' }, 0.6)
        .from('.pp__item', { opacity: 0, x: -14, duration: 0.5, stagger: 0.13 }, 0.7)
        .from('.pp__dot', { scale: 0, duration: 0.45, stagger: 0.13, ease: 'back.out(2.4)' }, 0.7)
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Anime.js: steps reveal as they scroll in; the rail fills in step with the scroll.
  useLayoutEffect(() => {
    const root = stepsRef.current
    if (!root || prefersReducedMotion()) return
    const scope = createScope({ root }).add(() => {
      animate('.step', {
        opacity: [0, 1],
        translateY: [32, 0],
        duration: 800,
        delay: stagger(140),
        ease: 'outExpo',
        autoplay: onScroll({ target: root, enter: '85% top', repeat: false }),
      })
      animate('.steps__rail-fill', {
        scaleX: [0, 1],
        ease: 'linear',
        autoplay: onScroll({ target: root, enter: '75% top', leave: '60% bottom', sync: true }),
      })
    })
    return () => scope.revert()
  }, [])

  return (
    <div className="landing">
      <section className="hero" ref={heroRef}>
        <div className="hero__glow" aria-hidden="true" />

        <div className="hero__copy">
          <p className="hero__eyebrow"><span className="hero__eyebrow-dot" aria-hidden="true" />A clear path to the cloud</p>
          <h1 className="hero__title">
            <SplitWords text="Learn cloud and DevOps in the order you will use it." accent="in the order" />
          </h1>
          <p className="hero__lead">
            One fixed path from Linux to Kubernetes and Terraform. Finish a topic to open the next,
            then build projects with what you learned.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn btn--primary btn--lg">Create a free account</Link>
            <Link to="/login" className="btn btn--secondary btn--lg">Log in</Link>
          </div>
          <p className="hero__fine">Beginner topics and two projects are free.</p>
        </div>

        <div className="hero-card">
          <div className="hero-card__head">The path</div>
          <ol className="preview-path" aria-label="The CloudLab learning path">
            <span className="pp__spine" aria-hidden="true" />
            {PREVIEW_PATH.map((item) => (
              <li key={item.name} className="pp__item">
                <span className="pp__dot" aria-hidden="true" />
                <span>
                  <span className="pp__name">{item.name}</span>
                  <span className="pp__note">{item.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="steps" ref={stepsRef} aria-labelledby="how-title">
        <h2 id="how-title" className="section-title">How it works</h2>
        <div className="steps__rail" aria-hidden="true"><div className="steps__rail-fill" /></div>
        <ol className="steps__list">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cta-band">
        <div className="cta-band__glow" aria-hidden="true" />
        <h2>Start with Linux today.</h2>
        <p>Free account, no card. The first topic is already open.</p>
        <div className="cta-band__actions">
          <Link to="/signup" className="btn btn--primary btn--lg">Create a free account</Link>
          {/* Placeholder: opens a public blank page (no login needed). Label and content to be decided. */}
          <Link to="/explore" className="btn btn--secondary btn--lg">Assignments &amp; Experiment</Link>
        </div>
      </section>
    </div>
  )
}
