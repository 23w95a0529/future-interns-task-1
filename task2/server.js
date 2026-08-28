require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const { ensureDb } = require('./db');

ensureDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Fallback 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mini CRM server running at http://localhost:${PORT}`);
  console.log(`  Demo contact form:  http://localhost:${PORT}/index.html`);
  console.log(`  Admin login:        http://localhost:${PORT}/login.html`);
});
