const { read, write, ensure, uuid } = require('./db');
const { hash } = require('./hash');

async function ensureSeedAdmin() {
  await ensure();
  const users = await read('users');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const exists = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!exists) {
    const passwordHash = await hash(adminPassword);
    const adminUser = { id: uuid(), role: 'admin', email: adminEmail, passwordHash };
    users.push(adminUser);
    await write('users', users);
    console.log(`Seeded default admin ${adminEmail}`);
  }
}

module.exports = { ensureSeedAdmin };
