# Warehouse Stock Transfer Management - Backend

## Overview

A simple REST API for a college case study. Staff can view warehouses/products and
request stock transfers between warehouses. Managers can manage warehouses/products
and approve or reject transfer requests. Stock only changes when a manager approves
a transfer.

## Tech Used

- Node.js + Express.js (plain JavaScript, CommonJS `require`)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for login tokens, `bcryptjs` for password hashing
- `dotenv` for environment variables, `cors` for cross-origin requests
- `nodemon` for auto-restart during development

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the example environment file and fill in your own values:
   ```
   cp .env.example .env
   ```
3. Start the server (auto-restarts on file changes):
   ```
   npm run dev
   ```
   or, without auto-restart:
   ```
   npm start
   ```

On success the console prints `Server running on port 5001` and `MongoDB connected`.

## Environment Variables

| Variable      | Meaning                                               |
| -------------- | ------------------------------------------------------ |
| `PORT`         | Port the Express server listens on                     |
| `MONGO_URI`    | MongoDB Atlas connection string                         |
| `JWT_SECRET`   | Secret key used to sign/verify login tokens             |
| `FRONTEND_URL` | The frontend's origin, allowed by CORS                  |

## Endpoints

### Auth (`/api/auth`)

| Method | Path       | Access |
| ------ | ---------- | ------ |
| POST   | /register  | Public |
| POST   | /login     | Public |

### Warehouses (`/api/warehouses`) - all routes require login

| Method | Path | Access |
| ------ | ---- | ------ |
| POST   | /     | Manager only |
| GET    | /     | Any logged-in user |
| GET    | /:id  | Any logged-in user |
| PUT    | /:id  | Manager only |
| DELETE | /:id  | Manager only |

### Products (`/api/products`) - all routes require login

| Method | Path | Access |
| ------ | ---- | ------ |
| POST   | /     | Manager only |
| GET    | /     | Any logged-in user |
| GET    | /:id  | Any logged-in user |
| PUT    | /:id  | Manager only |
| DELETE | /:id  | Manager only |

### Transfers (`/api/transfers`) - all routes require login

| Method | Path             | Access |
| ------ | ---------------- | ------ |
| POST   | /                 | Any logged-in user |
| GET    | /                 | Any logged-in user (supports `?status=pending/approved/rejected`) |
| PATCH  | /:id/approve      | Manager only |
| PATCH  | /:id/reject       | Manager only |

## Postman

Import `postman_collection.json` into Postman. Run "Login" first; it automatically
saves the JWT into the `token` collection variable for the rest of the requests.
