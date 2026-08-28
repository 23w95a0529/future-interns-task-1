// Optional helper: populate the database with a few sample leads so the
// dashboard has something to show immediately after cloning the repo.
// Run with: npm run seed
require('dotenv').config();
const { readDb, writeDb, ensureDb } = require('./db');

ensureDb();
const db = readDb();

const samples = [
  { name: 'Aditi Rao', email: 'aditi.rao@example.com', phone: '9876543210', source: 'website', message: 'Interested in a logo + branding package.', status: 'new' },
  { name: 'Marcus Chen', email: 'marcus.chen@example.com', phone: '9876500011', source: 'instagram', message: 'Saw your work, want a quote for a landing page.', status: 'contacted' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9123456780', source: 'referral', message: 'Referred by a past client, needs a full website.', status: 'converted' },
  { name: 'Daniel Osei', email: 'daniel.osei@example.com', phone: '9988776655', source: 'website', message: 'Looking for ongoing social media management.', status: 'new' }
];

const now = Date.now();

samples.forEach((s, i) => {
  const createdAt = new Date(now - (samples.length - i) * 86400000).toISOString();
  db.leads.push({
    id: db.nextLeadId++,
    ...s,
    notes:
      s.status !== 'new'
        ? [
            {
              id: db.nextNoteId++,
              text: s.status === 'converted' ? 'Signed the contract, kicking off next week.' : 'Called and left a voicemail, will follow up in 2 days.',
              author: 'admin',
              createdAt
            }
          ]
        : [],
    createdAt,
    updatedAt: createdAt
  });
});

writeDb(db);
console.log(`Seeded ${samples.length} sample leads.`);
