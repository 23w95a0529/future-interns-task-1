# Professional Portfolio Website

A clean, responsive and professional full-stack portfolio website for showcasing skills, projects, education and contact information.

## Features

- Responsive design for desktop, tablet and mobile
- Home, About, Skills, Projects, Resume and Contact sections
- Dark/light mode
- Mobile navigation menu
- Contact form
- Node.js + Express REST API
- MySQL database for contact messages and projects
- SEO-friendly HTML metadata
- GitHub-ready structure

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- MySQL

## Project Structure

```text
professional-portfolio/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   └── assets/images/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/db.js
│   ├── routes/contact.js
│   ├── routes/projects.js
│   └── database/portfolio.sql
├── README.md
└── .gitignore
```

## Requirements

Install these before running the project:

- Node.js
- MySQL
- VS Code (recommended)

## Database Setup

1. Open MySQL Workbench or MySQL command line.
2. Open `backend/database/portfolio.sql`.
3. Run the complete SQL script.
4. It creates `portfolio_db`, `contact_messages`, and `projects`.

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file by copying `.env.example` and update your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
```

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## Frontend Setup

Open `frontend/index.html` in a browser.

For the best local development experience, use the VS Code Live Server extension.

The contact form sends requests to:

```text
POST http://localhost:5000/api/contact
```

## API Endpoints

### Health Check

```text
GET /api/health
```

### Get Projects

```text
GET /api/projects
```

### Add Project

```text
POST /api/projects
```

Example JSON:

```json
{
  "title": "My Project",
  "description": "Project description",
  "technologies": "HTML, CSS, JavaScript",
  "github_url": "",
  "live_url": ""
}
```

### Contact

```text
POST /api/contact
```

Example JSON:

```json
{
  "name": "John",
  "email": "john@example.com",
  "subject": "Project opportunity",
  "message": "Hello!"
}
```

## Customize Your Portfolio

Before publishing, update:

- `Your Name`
- Email address
- Phone number
- Education
- GitHub profile
- LinkedIn profile
- Project descriptions
- Project links
- Skills
- Profile initials/avatar

Main file:

```text
frontend/index.html
```

## GitHub Upload

Create a new public repository on GitHub, then run:

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Deployment

### Frontend

The `frontend` folder can be deployed using a static hosting service.

### Backend

Deploy the `backend` folder to a Node.js-compatible hosting platform and configure the environment variables there.

### Database

Use a hosted MySQL database for production and update:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

After deployment, update the API URL in:

```text
frontend/js/script.js
```

Replace:

```text
http://localhost:5000
```

with your deployed backend URL.

## Final Submission Checklist

- [ ] Customize personal information
- [ ] Add real project links
- [ ] Add GitHub profile
- [ ] Add LinkedIn profile
- [ ] Test the contact form
- [ ] Test mobile layout
- [ ] Test dark mode
- [ ] Push source code to a public GitHub repository
- [ ] Deploy the website
- [ ] Add live website URL to internship submission

## License

This project is free to use and customize for your portfolio.
