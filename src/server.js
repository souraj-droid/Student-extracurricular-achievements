const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { ensureSeedAdmin } = require('./utils/seed');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const activityRoutes = require('./routes/activities');
const achievementRoutes = require('./routes/achievements');
const reportRoutes = require('./routes/reports');
const meRoutes = require('./routes/me');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/me', meRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 3000;

ensureSeedAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize:', err);
  process.exit(1);
});
