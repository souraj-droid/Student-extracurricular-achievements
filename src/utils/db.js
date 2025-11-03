const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', '..', 'data');
const files = {
  users: path.join(dataDir, 'users.json'),
  students: path.join(dataDir, 'students.json'),
  activities: path.join(dataDir, 'activities.json'),
  achievements: path.join(dataDir, 'achievements.json')
};

async function ensure() {
  await fsp.mkdir(dataDir, { recursive: true });
  for (const key of Object.keys(files)) {
    const p = files[key];
    try {
      await fsp.access(p);
    } catch (e) {
      await fsp.writeFile(p, '[]', 'utf-8');
    }
  }
}

async function read(key) {
  await ensure();
  const text = await fsp.readFile(files[key], 'utf-8');
  try {
    return JSON.parse(text || '[]');
  } catch (e) {
    return [];
  }
}

async function write(key, data) {
  await ensure();
  await fsp.writeFile(files[key], JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { read, write, files, dataDir, uuid: uuidv4, ensure };
