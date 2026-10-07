import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler } from '../api'
import { tokenStore } from '../api/tokenStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True until we know whether a stored token is still valid.
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()))

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await api.getMe()
    setUser(me)
    return me
  }, [])

  // Restore the session on first load.
  useEffect(() => {
    if (!tokenStore.get()) return
    refreshUser()
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false))
  }, [refreshUser])

  // Any 401 from a protected call means the token expired.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const login = useCallback(async (email, password) => {
    const { token } = await api.login(email, password)
    tokenStore.set(token)
    return refreshUser()
  }, [refreshUser])

  const signup = useCallback(async (name, email, password) => {
    const { token } = await api.signup(name, email, password)
    tokenStore.set(token)
    return refreshUser()
  }, [refreshUser])

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, signup, logout, refreshUser }),
    [user, loading, login, signup, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
