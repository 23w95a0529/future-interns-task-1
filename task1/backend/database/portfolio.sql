CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  technologies VARCHAR(255),
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (title,description,technologies,github_url,live_url) VALUES
('Personal Portfolio','Responsive portfolio website with project showcase and contact functionality.','HTML, CSS, JavaScript','',''),
('Task Management App','Application for creating, updating and tracking tasks with a REST API backend.','JavaScript, Node.js, MySQL','',''),
('E-Commerce Web App','Basic online store with product management and order tracking.','HTML, CSS, Node.js','',''),
('Blog Platform','Blogging platform with user authentication, posts and comments.','Express.js, MySQL, REST API','','');