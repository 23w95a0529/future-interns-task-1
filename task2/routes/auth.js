const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb } = require('../db');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '8h' }
  );

  res.json({ token, username: user.username });
});

// GET /api/auth/me - lets the frontend verify a stored token is still valid
router.get('/me', require('../middleware/authMiddleware'), (req, res) => {
  res.json({ username: req.user.username });
});

module.exports = router;
