import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { isMockMode } from '../api'

export default function AppShell() {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <NavBar />
      <main id="main" className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer__inner">
          CloudLab, a cloud and DevOps learning path.
          {isMockMode && ' Running on mock data: progress is stored in this browser only.'}
        </div>
      </footer>
    </div>
  )
}
