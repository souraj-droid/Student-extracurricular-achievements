import React, { useMemo, useState } from 'react'
import { Box, Button, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, InputLabel, FormControl } from '@mui/material'
import { useData } from '../../context/DataContext'

const TYPES = ['award', 'recognition', 'participation']

export default function Achievements() {
  const { students, activities, achievements, addAchievement } = useData()
  const [form, setForm] = useState({ studentId: '', activityId: '', title: '', type: 'participation', level: '', position: '', date: '', description: '' })
  const [filterStudent, setFilterStudent] = useState('')

  const filtered = useMemo(() => achievements.filter(a => !filterStudent || a.studentId === filterStudent), [achievements, filterStudent])

  const onAdd = (e) => {
    e.preventDefault()
    if (!form.studentId || !form.activityId || !form.title.trim()) return
    addAchievement(form)
    setForm(f => ({ ...f, title: '', level: '', position: '', date: '', description: '' }))
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Record Achievement</Typography>
      <Paper sx={{ p:2, mb:3 }}>
        <Box component="form" onSubmit={onAdd} sx={{ display:'grid', gap:2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="s-label">Student</InputLabel>
                <Select labelId="s-label" label="Student" value={form.studentId} onChange={e=>setForm(v=>({ ...v, studentId: e.target.value }))}>
                  {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="a-label">Activity</InputLabel>
                <Select labelId="a-label" label="Activity" value={form.activityId} onChange={e=>setForm(v=>({ ...v, activityId: e.target.value }))}>
                  {activities.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="t-label">Type</InputLabel>
                <Select labelId="t-label" label="Type" value={form.type} onChange={e=>setForm(v=>({ ...v, type: e.target.value }))}>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Title" value={form.title} onChange={e=>setForm(v=>({...v,title:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Level" value={form.level} onChange={e=>setForm(v=>({...v,level:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Position" value={form.position} onChange={e=>setForm(v=>({...v,position:e.target.value}))} /></Grid>
            <Grid item xs={12} md={3}><TextField fullWidth label="Date (YYYY-MM-DD)" value={form.date} onChange={e=>setForm(v=>({...v,date:e.target.value}))} /></Grid>
            <Grid item xs={12} md={9}><TextField fullWidth label="Description" value={form.description} onChange={e=>setForm(v=>({...v,description:e.target.value}))} /></Grid>
            <Grid item xs={12}><Button type="submit" variant="contained">Record</Button></Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:1 }}>
        <Typography variant="h6" gutterBottom sx={{ m:0 }}>All Achievements</Typography>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="fs-label">Filter by Student</InputLabel>
          <Select size="small" labelId="fs-label" label="Filter by Student" value={filterStudent} onChange={e=>setFilterStudent(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.id}>
                <TableCell>{students.find(s=>s.id===a.studentId)?.name || '—'}</TableCell>
                <TableCell>{activities.find(x=>x.id===a.activityId)?.name || '—'}</TableCell>
                <TableCell>{a.title}</TableCell>
                <TableCell sx={{ textTransform:'capitalize' }}>{a.type}</TableCell>
                <TableCell>{a.level}</TableCell>
                <TableCell>{a.position}</TableCell>
                <TableCell>{a.date}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7}>No achievements yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
