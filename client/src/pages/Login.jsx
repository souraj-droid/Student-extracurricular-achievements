import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin')
    else if (user?.role === 'student') navigate('/student')
  }, [user, navigate])

  const onSubmit = (e) => {
    e.preventDefault()
    const res = login(role, email, password)
    if (!res.ok) setError(res.error || 'Login failed')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Extracurricular Achievements
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Login</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup value={role} exclusive onChange={(_, v) => v && setRole(v)}>
            <ToggleButton value="student">Student</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained">Login</Button>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Box>
      </Paper>
    </Container>
  )
}
