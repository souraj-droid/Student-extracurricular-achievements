import React, { useMemo } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useData } from '../../context/DataContext'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function Reports() {
  const { students, activities, achievements } = useData()

  const byType = useMemo(() => achievements.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc }, {}), [achievements])
  const byStudent = useMemo(() => achievements.reduce((acc, a) => { acc[a.studentId] = (acc[a.studentId]||0)+1; return acc }, {}), [achievements])
  const top = useMemo(() => Object.entries(byStudent).sort((a,b)=>b[1]-a[1]).slice(0,5), [byStudent])

  const doughnutData = useMemo(() => ({
    labels: Object.keys(byType),
    datasets: [{
      label: 'Count',
      data: Object.values(byType),
      backgroundColor: ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6']
    }]
  }), [byType])

  const barData = useMemo(() => ({
    labels: top.map(([id]) => students.find(s=>s.id===id)?.name || 'Unknown'),
    datasets: [{
      label: 'Achievements',
      data: top.map(([,c]) => c),
      backgroundColor: '#3b82f6'
    }]
  }), [top, students])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="overline">Students</Typography>
            <Typography variant="h4" fontWeight={700}>{students.length}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="overline">Activities</Typography>
            <Typography variant="h4" fontWeight={700}>{activities.length}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="overline">Achievements</Typography>
            <Typography variant="h4" fontWeight={700}>{achievements.length}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>By Type</Typography>
            {Object.keys(byType).length ? <Doughnut data={doughnutData} /> : <Typography>No data</Typography>}
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Students</Typography>
            {top.length ? <Bar data={barData} options={{ responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true }}}} /> : <Typography>No data</Typography>}
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  )
}
