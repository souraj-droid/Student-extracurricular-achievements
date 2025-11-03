const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { read, write, uuid } = require('../utils/db');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired);

router.get('/', async (req, res) => {
  const activities = await read('activities');
  res.json(activities);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const schema = Joi.object({ name: Joi.string().required(), category: Joi.string().allow('') });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const activities = await read('activities');
  const activity = { id: uuid(), name: value.name, category: value.category || '' };
  activities.push(activity);
  await write('activities', activities);
  res.status(201).json(activity);
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const schema = Joi.object({ name: Joi.string(), category: Joi.string().allow('') });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const activities = await read('activities');
  const idx = activities.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  activities[idx] = { ...activities[idx], ...value };
  await write('activities', activities);
  res.json(activities[idx]);
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const activities = await read('activities');
  const idx = activities.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  activities.splice(idx, 1);
  await write('activities', activities);
  res.json({ success: true });
});

module.exports = router;
