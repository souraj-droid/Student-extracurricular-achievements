import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from './uuid'

// Minimal uuid util to avoid extra deps when building for Pages
function safeUuid() {
  try { return uuidv4() } catch { return Math.random().toString(36).slice(2) }
}

const STORAGE_KEY = 'sea_data_v1'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return { users: [], students: [], activities: [], achievements: [] }
  })

  // persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const seedIfNeeded = useCallback(() => {
    setData(prev => {
      if (prev.users.some(u => u.role === 'admin')) return prev
      return {
        ...prev,
        users: [
          ...prev.users,
          { id: safeUuid(), role: 'admin', email: 'admin@example.com', password: 'Admin@123' }
        ]
      }
    })
  }, [])

  const addStudent = useCallback(({ name, roll = '', className = '', section = '', email = '', password = '' }) => {
    const id = safeUuid()
    setData(prev => {
      const students = [...prev.students, { id, name, roll, className, section, avatarUrl: '' }]
      let users = prev.users
      if (email && password) {
        if (prev.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          alert('Email already exists')
          return prev
        }
        users = [...prev.users, { id: safeUuid(), role: 'student', email, password, studentId: id }]
      }
      return { ...prev, students, users }
    })
    return id
  }, [])

  const addActivity = useCallback(({ name, category = '' }) => {
    const id = safeUuid()
    setData(prev => ({ ...prev, activities: [...prev.activities, { id, name, category }] }))
    return id
  }, [])

  const addAchievement = useCallback(({ studentId, activityId, title, type, level = '', position = '', date = '', description = '' }) => {
    if (!studentId || !activityId || !title || !type) return
    const id = safeUuid()
    setData(prev => ({ ...prev, achievements: [...prev.achievements, { id, studentId, activityId, title, type, level, position, date, description }] }))
    return id
  }, [])

  const removeStudent = useCallback((id) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
      users: prev.users.filter(u => u.studentId !== id),
      achievements: prev.achievements.filter(a => a.studentId !== id)
    }))
  }, [])

  const updateStudent = useCallback((id, patch) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...patch } : s)
    }))
  }, [])

  const value = useMemo(() => ({
    ...data,
    seedIfNeeded,
    addStudent,
    addActivity,
    addAchievement,
    removeStudent,
    updateStudent
  }), [data, seedIfNeeded, addStudent, addActivity, addAchievement, removeStudent, updateStudent])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
