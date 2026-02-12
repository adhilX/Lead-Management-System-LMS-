# Lead Management System (CRM)

A mini CRM application to manage sales leads with authentication, CRUD operations, advanced filtering, and analytics. Built for the MERN Stack Assignment.

## Features

- **Authentication**: JWT-based (Register/Login).
- **Lead Management**: Full CRUD operations for sales leads.
- **Advanced List API**: Search, filter by status/source, date range filtering, sorting, and pagination.
- **Analytics**: Dashboard statistics using MongoDB aggregation.
- **Responsive UI**: Modern dashboard with stats cards and lead table.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), TypeScript.
- **Validation**: Zod (Backend & Frontend).

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or MongoDB Atlas URI)

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create `.env` file based on `.env.example`.
4. Start dev server: `npm run dev`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Create `.env` file based on `.env.example`.
4. Start dev server: `npm run dev`.

## API Documentation

### Auth
- `POST /auth/register`: Create a new user.
- `POST /auth/login`: Authenticate and get JWT.

### Leads
- `GET /leads`: List leads with filters (`q`, `status`, `source`, `createdFrom`, `createdTo`, `sort`, `page`, `limit`).
- `POST /leads`: Create a lead (Protected).
- `GET /leads/:id`: Get lead details (Protected).
- `PATCH /leads/:id`: Update a lead (Protected).
- `DELETE /leads/:id`: Delete a lead (Protected).
- `GET /leads/stats/summary`: Get analytics summary (Protected).

## Seed Sample Data
Run the following command in the `/backend` directory to populate the database with sample leads:
```bash
npx ts-node src/scripts/seed.ts
```

## Assumptions & Design Decisions
- Leads are user-specific (filtered by `createdBy`).
- Statistics are computed in real-time using MongoDB aggregation.
- Passwords are hashed using bcrypt.
- JWT tokens are used for stateless authentication.
