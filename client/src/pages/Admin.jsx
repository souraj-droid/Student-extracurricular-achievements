import React from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Students from './admin/Students'
import Activities from './admin/Activities'
import Achievements from './admin/Achievements'
import Reports from './admin/Reports'

export default function Admin() {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Admin Dashboard</Typography>
          <Button color={pathname.includes('/admin/students') ? 'inherit' : 'secondary'} component={RouterLink} to="/admin/students">Students</Button>
          <Button color={pathname.includes('/admin/activities') ? 'inherit' : 'secondary'} component={RouterLink} to="/admin/activities">Activities</Button>
          <Button color={pathname.includes('/admin/achievements') ? 'inherit' : 'secondary'} component={RouterLink} to="/admin/achievements">Achievements</Button>
          <Button color={pathname.includes('/admin/reports') ? 'inherit' : 'secondary'} component={RouterLink} to="/admin/reports">Reports</Button>
          <Button color="inherit" onClick={logout} sx={{ ml: 2 }} component={RouterLink} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="students" element={<Students />} />
          <Route path="activities" element={<Activities />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="students" />} />
        </Routes>
      </Container>
    </Box>
  )
}
