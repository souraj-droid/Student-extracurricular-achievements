const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { read, write, uuid } = require('../utils/db');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired);

router.get('/', async (req, res) => {
  const qStudentId = req.query.studentId;
  if (req.user.role === 'student') {
    const all = await read('achievements');
    const mine = all.filter(a => a.studentId === req.user.studentId);
    return res.json(mine);
  }
  const achievements = await read('achievements');
  if (qStudentId) return res.json(achievements.filter(a => a.studentId === qStudentId));
  res.json(achievements);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const schema = Joi.object({
    studentId: Joi.string().required(),
    activityId: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().valid('award', 'recognition', 'participation').required(),
    level: Joi.string().allow(''),
    position: Joi.string().allow(''),
    date: Joi.string().allow(''),
    description: Joi.string().allow(''),
    certificateUrl: Joi.string().uri().allow('')
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const achievements = await read('achievements');
  const achievement = { id: uuid(), ...value };
  achievements.push(achievement);
  await write('achievements', achievements);
  res.status(201).json(achievement);
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const schema = Joi.object({
    studentId: Joi.string(),
    activityId: Joi.string(),
    title: Joi.string(),
    type: Joi.string().valid('award', 'recognition', 'participation'),
    level: Joi.string().allow(''),
    position: Joi.string().allow(''),
    date: Joi.string().allow(''),
    description: Joi.string().allow(''),
    certificateUrl: Joi.string().uri().allow('')
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const achievements = await read('achievements');
  const idx = achievements.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  achievements[idx] = { ...achievements[idx], ...value };
  await write('achievements', achievements);
  res.json(achievements[idx]);
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const achievements = await read('achievements');
  const idx = achievements.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  achievements.splice(idx, 1);
  await write('achievements', achievements);
  res.json({ success: true });
});

module.exports = router;
