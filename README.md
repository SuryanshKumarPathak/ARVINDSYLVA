# Arvind Sylva

A modern real-estate lead generation and CRM platform built for property sales operations. This project combines a marketing landing page with an admin dashboard to capture leads, manage follow-ups, track analytics, and operate internal workflows efficiently.

## Overview

Arvind Sylva helps real-estate teams manage:

- property lead acquisition from a landing page
- lead tracking and assignment
- follow-up workflows
- admin analytics and reporting
- secure authentication for team members
- CRM-style lead management dashboard

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Cookie-based session handling
- Express validators and rate limiting

### Project Structure

```text
arvind-sylva/
├── client/                  # Frontend application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                  # Backend API and business logic
│   ├── src/
│   ├── scripts/
│   └── package.json
├── package.json             # Root scripts for running both apps
├── README.md
├── .gitignore
└── LICENSE                 # Add if required later
```

## Features

- Responsive real-estate marketing landing page
- Lead submission form for property inquiries
- Admin login and protected dashboard routes
- Lead management and detail views
- Follow-up tracking
- Dashboard analytics
- User and admin role support
- Secure API configuration and environment-based secrets

## Local Development

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB instance

### Install dependencies

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### Environment setup

Create a `.env` file inside the `server` folder with the required values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.w7czmbd.mongodb.net/arvind-sylva?retryWrites=true&w=majority&appName=Cluster0
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
COOKIE_SECRET=your_cookie_secret
CLIENT_URL=http://localhost:5173
SEED_ADMIN_NAME=Super Admin
SEED_ADMIN_EMAIL=admin@arvindsylva.com
SEED_ADMIN_PASSWORD=Change@Me
```

### Run the project

From the root directory:

```bash
npm run dev
```

This starts both the backend and frontend development servers.

### Seed admin user

```bash
cd server
npm run seed:admin
```

Default admin login:

- Email: `admin@arvindsylva.com`
- Password: `Change@Me`

> Change this password immediately after first login in production.

## Scripts

Root scripts:

```bash
npm run dev
npm run build
npm run start
npm run seed:admin
```

## Production Notes

- Store secrets in environment variables, never in source control
- Keep MongoDB Atlas IP whitelisting enabled for production deployments
- Use strong JWT secrets and secure cookie configuration
- Update SMTP credentials before deploying email features

## Deployment

This application is structured for deployment using a Node.js backend and a Vite frontend. For production deployment, you can host:

- Frontend: Vercel, Netlify, or any static hosting platform
- Backend: Render, Railway, DigitalOcean App Platform, or VPS
- Database: MongoDB Atlas

## Repository

GitHub:

```text
https://github.com/SuryanshKumarPathak/ARVINDSYLVA.git
```

## License

This project is currently intended for internal project use and is not yet published under a public license.

## Contact

For business or project coordination, reach out through the official project contact channels configured in the application.
