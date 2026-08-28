const express = require('express');
const { readDb, writeDb } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const VALID_STATUSES = ['new', 'contacted', 'converted'];

/**
 * PUBLIC ENDPOINT
 * This is the one route a business's actual website contact form would call.
 * No auth required - anyone submitting the public form can create a lead.
 * POST /api/leads/public
 * body: { name, email, phone?, message?, source? }
 */
router.post('/public', (req, res) => {
  const { name, email, phone, message, source } = req.body || {};

  if (!name || !name.trim() || !email || !email.trim()) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const db = readDb();
  const now = new Date().toISOString();

  const lead = {
    id: db.nextLeadId++,
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    message: (message || '').trim(),
    source: (source || 'website').trim(),
    status: 'new',
    notes: [],
    createdAt: now,
    updatedAt: now
  };

  db.leads.push(lead);
  writeDb(db);

  res.status(201).json({ message: 'Thanks! We received your message and will be in touch soon.', lead });
});

// -------------------------------------------------------------------------
// Everything below this line is the admin-only side of the CRM.
// -------------------------------------------------------------------------
router.use(authMiddleware);

// GET /api/leads?status=new&search=jane
router.get('/', (req, res) => {
  const { status, search } = req.query;
  const db = readDb();

  let leads = db.leads;

  if (status && VALID_STATUSES.includes(status)) {
    leads = leads.filter((l) => l.status === status);
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        (l.source || '').toLowerCase().includes(s)
    );
  }

  leads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ leads, total: leads.length });
});

// GET /api/leads/analytics/summary
router.get('/analytics/summary', (req, res) => {
  const db = readDb();
  const total = db.leads.length;
  const counts = { new: 0, contacted: 0, converted: 0 };

  db.leads.forEach((l) => {
    if (counts[l.status] !== undefined) counts[l.status]++;
  });

  const conversionRate = total ? Math.round((counts.converted / total) * 1000) / 10 : 0;

  res.json({ total, counts, conversionRate });
});

// GET /api/leads/:id
router.get('/:id', (req, res) => {
  const db = readDb();
  const lead = db.leads.find((l) => l.id === Number(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ lead });
});

// PATCH /api/leads/:id/status   body: { status }
router.patch('/:id/status', (req, res) => {
  const { status } = req.body || {};

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const db = readDb();
  const lead = db.leads.find((l) => l.id === Number(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  writeDb(db);

  res.json({ lead });
});

// POST /api/leads/:id/notes   body: { text }
router.post('/:id/notes', (req, res) => {
  const { text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Note text is required' });
  }

  const db = readDb();
  const lead = db.leads.find((l) => l.id === Number(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const note = {
    id: db.nextNoteId++,
    text: text.trim(),
    author: req.user.username,
    createdAt: new Date().toISOString()
  };

  lead.notes.push(note);
  lead.updatedAt = new Date().toISOString();
  writeDb(db);

  res.status(201).json({ note });
});

// DELETE /api/leads/:id
router.delete('/:id', (req, res) => {
  const db = readDb();
  const idx = db.leads.findIndex((l) => l.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

  db.leads.splice(idx, 1);
  writeDb(db);

  res.json({ message: 'Lead deleted' });
});

module.exports = router;
