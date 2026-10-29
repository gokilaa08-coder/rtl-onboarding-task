# Record Technology Labs - Full Stack Developer Onboarding Task

Multi-step onboarding form system with authentication, persistent data storage (MongoDB), auto-save/retrieval functionality, and a final summary dashboard.

## Tech Stack
- **Frontend:** React (TypeScript), Vite, Tailwind CSS, Shadcn-style UI, Lucide Icons, Axios, React Router DOM
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js

## Project Architecture
- `backend/` - REST API with routes for authentication (`/api/auth`) and multi-step form persistence (`/api/form`).
- `frontend/` - Responsive React application styled with Tailwind CSS, supporting auto-save, forward/backward navigation data persistence, and protected routes.

## How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev