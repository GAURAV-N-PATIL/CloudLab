import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import GridBackground from './components/GridBackground'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import RoadmapPage from './pages/RoadmapPage'
import TopicPage from './pages/TopicPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProfilePage from './pages/ProfilePage'
import PricingPage from './pages/PricingPage'
import AuthForm from './pages/AuthForm'
import NotFoundPage from './pages/NotFoundPage'
import ExplorePage from './pages/ExplorePage'

export default function App() {
  return (
    <>
      <GridBackground />
      <Routes>
        {/* Login and signup are full-screen: no nav bar or footer. */}
        <Route element={<Outlet />}>
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/signup" element={<AuthForm mode="signup" />} />
        </Route>

        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/roadmap/:slug" element={<TopicPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
