const express = require('express');
const router = express.Router();
const { read } = require('../utils/db');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired);
router.use(requireRole('admin'));

router.get('/summary', async (req, res) => {
  const students = await read('students');
  const activities = await read('activities');
  const achievements = await read('achievements');
  const byType = achievements.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {});
  const byStudent = achievements.reduce((acc, a) => { acc[a.studentId] = (acc[a.studentId] || 0) + 1; return acc; }, {});
  const top = Object.entries(byStudent).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, count]) => {
    const s = students.find(st => st.id === id);
    return { studentId: id, name: s ? s.name : 'Unknown', count };
  });
  res.json({ totals: { students: students.length, activities: activities.length, achievements: achievements.length }, byType, top });
});

module.exports = router;
