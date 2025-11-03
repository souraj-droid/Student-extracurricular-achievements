import React, { useMemo } from 'react'
import { AppBar, Box, Button, Card, CardContent, Container, Grid, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Link as RouterLink } from 'react-router-dom'

export default function Student() {
  const { user, logout } = useAuth()
  const { students, achievements, activities } = useData()

  const student = useMemo(() => students.find(s => s.id === user?.studentId), [students, user])
  const myAchievements = useMemo(() => achievements.filter(a => a.studentId === user?.studentId), [achievements, user])

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>My Dashboard</Typography>
          <Button color="inherit" onClick={logout} component={RouterLink} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Profile</Typography>
            {student ? (
              <Box sx={{ mt:1 }}>
                <Typography>Name: {student.name}</Typography>
                <Typography>Class: {student.className || '—'} {student.section || ''}</Typography>
                <Typography>Roll: {student.roll || '—'}</Typography>
                <Typography>Email: {user?.email}</Typography>
              </Box>
            ) : (
              <Typography>No profile found.</Typography>
            )}
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>My Achievements</Typography>
        {myAchievements.length === 0 && <Typography>No achievements yet.</Typography>}
        <Grid container spacing={2}>
          {myAchievements.map(a => (
            <Grid item xs={12} md={6} key={a.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform:'capitalize' }}>
                    {a.type} • {a.level || '—'} {a.position || ''} {a.date || ''}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{a.description || ''}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Activity: {activities.find(x=>x.id===a.activityId)?.name || '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
