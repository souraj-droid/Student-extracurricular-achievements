const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { read } = require('../utils/db');
const { compare } = require('../utils/hash');

router.post('/login', async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const email = (value.email || '').trim();
  const password = (value.password || '').trim();
  const users = await read('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email, studentId: user.studentId || null }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' });
  res.json({ token, role: user.role });
});

module.exports = router;
