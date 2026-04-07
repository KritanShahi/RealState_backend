# RealState API

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migration:
   - `npm run prisma:migrate`
5. Seed properties:
   - `npm run prisma:seed`
6. Start API:
   - `npm run dev`

## Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me` (auth required)
- `GET /properties` (auth required)
- `GET /favourites` (auth required)
- `POST /favourites/:propertyId` (auth required)
- `DELETE /favourites/:propertyId` (auth required)

## Auth
- Auth token is issued as `httpOnly` cookie named `token`.
- You can also pass `Authorization: Bearer <token>`.
