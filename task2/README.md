# Mini CRM — Client Lead Management System

A small, self-contained CRM for handling leads that come in through a website
contact form: store them, track their status through a pipeline (**new →
contacted → converted**), log follow-up notes, and see the numbers at a
glance — all behind an admin login.

Built for the *Future Interns* Client Lead Management System task.

![status](https://img.shields.io/badge/status-working-2f5d62)

---

## Features

- **Public lead capture** — a `/api/leads/public` endpoint any website
  contact form can POST to (a working demo form is included at
  `index.html`).
- **Admin login** — JWT-based authentication; only signed-in admins can view
  or manage leads (`login.html`).
- **Lead dashboard** — every lead in a searchable, filterable table with a
  visual pipeline indicator (`dashboard.html`).
- **Status pipeline** — move a lead through `new → contacted → converted`
  with one click.
- **Follow-up notes** — timestamped, author-tagged notes per lead, so nothing
  falls through the cracks.
- **Analytics** — total leads, count per stage, and conversion rate, updated
  live.
- **Search & filter** — by name, email, source, or status.
- **Delete lead** — remove a lead entirely.

## Tech stack

| Layer     | Choice                                             |
|-----------|-----------------------------------------------------|
| Backend   | Node.js + Express                                  |
| Auth      | JWT (`jsonwebtoken`) + hashed passwords (`bcryptjs`) |
| Database  | A small JSON file store (`data/db.json`) via `db.js` |
| Frontend  | Plain HTML/CSS/JS (no build step required)          |

**Why a JSON file instead of MongoDB/MySQL?** It keeps the whole project
runnable with `npm install && npm start` and no external database service —
useful for grading, demos, or running on a machine with nothing preinstalled.
Every route only ever calls `readDb()` / `writeDb()` from `db.js`, so
swapping in a real MongoDB (Mongoose) or MySQL (Sequelize) layer later is a
contained change — see [Swapping in a real database](#swapping-in-a-real-database)
below.

## Project structure

```
mini-crm/
├─ server.js              # Express app entry point
├─ db.js                  # JSON file "database" (read/write helpers)
├─ seed.js                # Optional: populate sample leads
├─ routes/
│  ├─ auth.js              # POST /api/auth/login, GET /api/auth/me
│  └─ leads.js             # Public intake + admin CRUD/notes/analytics
├─ middleware/
│  └─ authMiddleware.js    # JWT verification for admin routes
├─ public/                 # Static frontend (served by Express)
│  ├─ index.html           # Demo "client website" contact form
│  ├─ login.html           # Admin login
│  ├─ dashboard.html       # Admin dashboard
│  ├─ css/style.css
│  └─ js/{api,dashboard}.js
├─ data/db.json            # Created automatically on first run
├─ .env.example
└─ package.json
```

## Getting started

**Requirements:** Node.js 16+ (no database server needed).

```bash
git clone <your-repo-url>
cd mini-crm
npm install
cp .env.example .env      # edit if you want a custom admin username/password
npm run seed               # optional: adds 4 sample leads so the dashboard isn't empty
npm start
```

The server starts on **http://localhost:4000**:

- `http://localhost:4000/index.html` — the public contact form (simulates a
  client's website)
- `http://localhost:4000/login.html` — admin login

**Default admin credentials** (from `.env.example`, only used the very first
time the database is created):

```
username: admin
password: admin123
```

Change these in `.env` before the first run (or edit `data/db.json`'s user
afterward) for anything beyond local testing.

## How it works, end to end

1. A visitor fills out the form at `index.html` and submits it. This calls
   `POST /api/leads/public` — no login required, exactly like a real
   contact-form backend.
2. The lead is stored with `status: "new"` and a timestamp.
3. An admin logs in at `login.html`, which calls `POST /api/auth/login` and
   stores the returned JWT in `localStorage`.
4. `dashboard.html` uses that token on every request (`Authorization: Bearer
   <token>`) to list leads, filter/search them, update status, add notes, or
   delete a lead.
5. The stat cards at the top of the dashboard call
   `GET /api/leads/analytics/summary` for live totals and conversion rate.

## API reference

| Method | Endpoint                         | Auth  | Description                          |
|--------|-----------------------------------|-------|---------------------------------------|
| POST   | `/api/leads/public`               | No    | Create a lead (contact form submit)  |
| POST   | `/api/auth/login`                 | No    | Log in, returns a JWT                |
| GET    | `/api/auth/me`                    | Yes   | Verify the current token             |
| GET    | `/api/leads?status=&search=`      | Yes   | List/search/filter leads             |
| GET    | `/api/leads/:id`                  | Yes   | Get one lead (with notes)            |
| PATCH  | `/api/leads/:id/status`           | Yes   | Update status (`new/contacted/converted`) |
| POST   | `/api/leads/:id/notes`            | Yes   | Add a follow-up note                 |
| DELETE | `/api/leads/:id`                  | Yes   | Delete a lead                        |
| GET    | `/api/leads/analytics/summary`    | Yes   | Total leads, per-stage counts, conversion rate |

Protected routes expect `Authorization: Bearer <token>`, obtained from
`POST /api/auth/login`.

## Swapping in a real database

To move from the bundled JSON store to MongoDB or MySQL:

1. Replace `db.js`'s `readDb`/`writeDb` with model calls (Mongoose schemas
   for `User` and `Lead`, or Sequelize models).
2. The route files (`routes/auth.js`, `routes/leads.js`) don't need to
   change their shape — just swap the data-access calls inside each handler.
3. Add your connection string to `.env` (e.g. `MONGODB_URI` or
   `MYSQL_URL`) and connect on server start in `server.js`.

## Notes on security

- Passwords are hashed with bcrypt, never stored in plain text.
- Admin routes are protected by JWT middleware; the token expires after 8
  hours.
- The public lead-intake endpoint is intentionally open (like a real contact
  form) but only ever *creates* a lead — it can't read, edit, or list
  existing leads.

## License

MIT — free to use as a portfolio project or a starting point for real
client work.
