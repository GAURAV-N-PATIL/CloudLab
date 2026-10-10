import { useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isMockMode } from '../api'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'

export default function Footer() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const footerRef = useRef(null)
  const markRef = useRef(null)

  // The big wordmark rises into view as the footer scrolls in (scrubbed to scroll position).
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !markRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        markRef.current,
        { yPercent: 38, opacity: 0.2 },
        {
          yPercent: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: footerRef.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        },
      )
    }, footerRef)
    // Page height changes after data loads, so re-measure shortly after navigation.
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(t); ctx.revert() }
  }, [pathname])

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/home" className="nav__brand">
            <span className="nav__brand-mark"><Cloud size={17} aria-hidden="true" /></span>
            CloudLab
          </Link>
          <p>A fixed path through cloud and DevOps, from Linux to Kubernetes, Terraform and your first cloud.</p>
        </div>

        <nav className="footer__col" aria-label="Learn">
          <h2>Learn</h2>
          <ul>
            <li><Link to={isAuthenticated ? '/roadmap' : '/signup'}>Roadmap</Link></li>
            <li><Link to={isAuthenticated ? '/projects' : '/signup'}>Projects</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Account">
          <h2>Account</h2>
          <ul>
            {isAuthenticated ? (
              <li><Link to="/profile">Profile</Link></li>
            ) : (
              <>
                <li><Link to="/login">Log in</Link></li>
                <li><Link to="/signup">Create account</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="footer__legal">
        A mini project for Entrepreneurship Development and Full Stack Java Programming.
        {isMockMode && ' Running on mock data: progress is stored in this browser only.'}
      </div>

      <div className="footer__mark" ref={markRef} aria-hidden="true">CloudLab</div>
    </footer>
  )
}
