import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Student from './pages/Student'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

function StudentRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" />
  if (user.role !== 'student') return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/student" element={<StudentRoute><Student /></StudentRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}
