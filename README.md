# Real Estate API (Backend)

A backend API for the Real Estate Next.js app built with Express, TypeScript, and PostgreSQL (Prisma ORM).

## Environment Variables

Create a `.env` file in the root directory:


DATABASE_URL=postgresql://postgres:password@localhost:5432/db_name?schema=public 

JWT_SECRET="secretkey"

PORT=4000

CORS_ORIGIN="http://localhost:3000"

## Setup
Clone the repository:
git clone https://github.com/KritanShahi/RealState_backend.git

Copy .env and update values.

## Install dependencies:

npm install

### Generate Prisma client:

npm run prisma:generate

### Run database migration:

npm run prisma:migrate

### Seed initial properties:

npm run prisma:seed

## Start API server:

npm run dev

The API will run on http://localhost:4000.