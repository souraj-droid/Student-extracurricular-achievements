const bcrypt = require('bcryptjs');

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function compare(password, hashValue) {
  return bcrypt.compare(password, hashValue);
}

module.exports = { hash, compare };
