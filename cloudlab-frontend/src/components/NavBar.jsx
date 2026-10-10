import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/home')
  }

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/home" className="nav__brand">
          <Cloud size={22} aria-hidden="true" />
          CloudLab
        </Link>
        <nav className="nav__links" aria-label="Main">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          {isAuthenticated && <NavLink to="/roadmap" className={linkClass}>Roadmap</NavLink>}
          {isAuthenticated && <NavLink to="/projects" className={linkClass}>Projects</NavLink>}
          <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
          {isAuthenticated && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
        </nav>
        <div className="nav__actions">
          {isAuthenticated ? (
            <>
              <span className="nav__user">{user.name}</span>
              <button type="button" className="btn btn--ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Log in</Link>
              <Link to="/signup" className="btn btn--primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
