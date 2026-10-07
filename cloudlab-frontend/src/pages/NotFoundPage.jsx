import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="state">
      <h1>Page not found</h1>
      <p>That address does not exist. Check the link, or go back to the start.</p>
      <Link to="/home" className="btn btn--primary">Go to home</Link>
    </div>
  )
}
