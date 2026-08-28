// Simple file-based JSON "database".
//
// Why not MongoDB/MySQL out of the box? This keeps the project runnable with
// zero external services (great for grading/demoing). Swapping this file for
// a real Mongoose/Sequelize model layer is a drop-in change - every route
// only talks to `readDb()` / `writeDb()`, never to the file directly.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    const initial = {
      users: [{ id: 1, username: adminUsername, passwordHash }],
      leads: [],
      nextLeadId: 1,
      nextNoteId: 1
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    console.log(`Created new database with admin user "${adminUsername}"`);
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb, ensureDb, DB_PATH };
