import React, { useMemo, useState } from 'react'
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useData } from '../../context/DataContext'

export default function Students() {
  const { students, users, addStudent, removeStudent } = useData()
  const [form, setForm] = useState({ name: '', roll: '', className: '', section: '', email: '', password: '' })

  const studentUsers = useMemo(() => new Map(users.filter(u => u.role==='student').map(u => [u.studentId, u])), [users])

  const onAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addStudent(form)
    setForm({ name: '', roll: '', className: '', section: '', email: '', password: '' })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Create Student</Typography>
      <Paper sx={{ p:2, mb:3 }}>
        <Box component="form" onSubmit={onAdd} sx={{ display:'grid', gap:2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}><TextField fullWidth label="Name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Roll" value={form.roll} onChange={e=>setForm(v=>({...v,roll:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Class" value={form.className} onChange={e=>setForm(v=>({...v,className:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Section" value={form.section} onChange={e=>setForm(v=>({...v,section:e.target.value}))} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Email (for student login)" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth type="password" label="Password" value={form.password} onChange={e=>setForm(v=>({...v,password:e.target.value}))} /></Grid>
            <Grid item xs={12} md={4}><Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>Add</Button></Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Students</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Login Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.roll}</TableCell>
                <TableCell>{s.className}</TableCell>
                <TableCell>{s.section}</TableCell>
                <TableCell>{studentUsers.get(s.id)?.email || '-'}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={()=>removeStudent(s.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow><TableCell colSpan={6}>No students yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
