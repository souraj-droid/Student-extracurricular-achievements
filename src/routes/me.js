const express = require('express');
const router = express.Router();
const { read, write } = require('../utils/db');
const { authRequired } = require('../middleware/auth');
const Joi = require('joi');
const { hash, compare } = require('../utils/hash');

router.use(authRequired);

router.get('/', async (req, res) => {
  res.json({ id: req.user.id, role: req.user.role, email: req.user.email, studentId: req.user.studentId || null });
});

router.get('/profile', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const students = await read('students');
  const student = students.find(s => s.id === req.user.studentId);
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json(student);
});

router.get('/achievements', async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const achievements = await read('achievements');
  const mine = achievements.filter(a => a.studentId === req.user.studentId);
  res.json(mine);
});

router.put('/password', async (req, res) => {
  const schema = Joi.object({ currentPassword: Joi.string().required(), newPassword: Joi.string().min(6).required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const users = await read('users');
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const ok = await compare(value.currentPassword, users[idx].passwordHash);
  if (!ok) return res.status(400).json({ error: 'Current password incorrect' });
  users[idx].passwordHash = await hash(value.newPassword);
  await write('users', users);
  res.json({ success: true });
});

module.exports = router;
