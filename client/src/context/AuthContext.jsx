import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

const LS_USER_KEY = 'sea_current_user'

export function AuthProvider({ children }) {
  const { users, seedIfNeeded } = useData()
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_USER_KEY)) || null } catch { return null }
  })

  useEffect(() => { seedIfNeeded() }, [seedIfNeeded])

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(LS_USER_KEY)
  }, [user])

  const login = (role, email, password) => {
    const em = (email || '').trim().toLowerCase()
    const pw = (password || '').trim()
    const u = users.find(u => u.role === role && u.email.toLowerCase() === em && u.password === pw)
    if (!u) return { ok: false, error: 'Invalid credentials' }
    const current = { id: u.id, role: u.role, email: u.email, studentId: u.studentId || null }
    setUser(current)
    return { ok: true, user: current }
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
