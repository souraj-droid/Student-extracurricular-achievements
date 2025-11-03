const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { read, write, uuid } = require('../utils/db');
const { hash } = require('../utils/hash');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired);

router.get('/', requireRole('admin'), async (req, res) => {
  const students = await read('students');
  res.json(students);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    roll: Joi.string().allow(''),
    class: Joi.string().allow(''),
    section: Joi.string().allow(''),
    avatarUrl: Joi.string().uri().allow(''),
    email: Joi.string().email().allow(''),
    password: Joi.string().min(6).allow(''),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const students = await read('students');
  const id = uuid();
  const student = { id, name: value.name, roll: value.roll || '', class: value.class || '', section: value.section || '', avatarUrl: value.avatarUrl || '' };
  students.push(student);
  await write('students', students);
  if (value.email && value.password) {
    const users = await read('users');
    if (users.some(u => u.email.toLowerCase() === value.email.toLowerCase())) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const passwordHash = await hash(value.password);
    users.push({ id: uuid(), role: 'student', email: value.email, passwordHash, studentId: id });
    await write('users', users);
  }
  res.status(201).json(student);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.studentId !== id) return res.status(403).json({ error: 'Forbidden' });
  const students = await read('students');
  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json(student);
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const schema = Joi.object({ name: Joi.string(), roll: Joi.string().allow(''), class: Joi.string().allow(''), section: Joi.string().allow(''), avatarUrl: Joi.string().uri().allow('') });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const students = await read('students');
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  students[idx] = { ...students[idx], ...value };
  await write('students', students);
  res.json(students[idx]);
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const students = await read('students');
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  students.splice(idx, 1);
  await write('students', students);
  const users = await read('users');
  const filteredUsers = users.filter(u => u.studentId !== id);
  if (filteredUsers.length !== users.length) await write('users', filteredUsers);
  const achievements = await read('achievements');
  const filteredAch = achievements.filter(a => a.studentId !== id);
  if (filteredAch.length !== achievements.length) await write('achievements', filteredAch);
  res.json({ success: true });
});

module.exports = router;
