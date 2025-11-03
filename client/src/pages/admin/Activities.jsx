import React, { useState } from 'react'
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useData } from '../../context/DataContext'

export default function Activities() {
  const { activities, addActivity } = useData()
  const [form, setForm] = useState({ name: '', category: '' })

  const onAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addActivity(form)
    setForm({ name: '', category: '' })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Create Activity</Typography>
      <Paper sx={{ p:2, mb:3 }}>
        <Box component="form" onSubmit={onAdd} sx={{ display:'grid', gap:2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}><TextField fullWidth label="Name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} /></Grid>
            <Grid item xs={12} md={5}><TextField fullWidth label="Category" value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value}))} /></Grid>
            <Grid item xs={12} md={2}><Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>Add</Button></Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Activities</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.category}</TableCell>
              </TableRow>
            ))}
            {activities.length === 0 && (
              <TableRow><TableCell colSpan={2}>No activities yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
