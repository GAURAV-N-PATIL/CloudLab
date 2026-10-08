import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

export default function AppShell() {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <NavBar />
      <main id="main" className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
