# Real-Time Expert Session Booking System

Full-stack booking system built with React (web), Node.js, Express, MongoDB, and Socket.io.

## Features

- Expert listing with search, category filter, pagination, and loading/error states.
- Expert detail view with grouped availability by date.
- Booking flow with validation, success feedback, and duplicate-slot protection.
- My bookings view by email with Pending, Confirmed, and Completed statuses.
- Real-time slot refresh when a booking is created elsewhere.

## Tech Stack

- Frontend: React + Vite + React Router + Socket.io client
- Backend: Node.js + Express + MongoDB + Mongoose + Socket.io

## Project Structure

- `client/` React web app
- `server/` Express API and Socket.io server

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expert-booking
CLIENT_ORIGIN=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Install

```bash
npm install
```

## Run

Start the backend:

```bash
npm run dev:server
```

Start the frontend in another terminal:

```bash
npm run dev:client
```

## Booking Rules

- The backend prevents double booking with a unique compound index on `expertId + date + timeSlot`.
- If two users submit the same slot at the same time, one request succeeds and the other receives a `409 Conflict` response.
- After a successful booking, the server emits a Socket.io event so open detail screens refresh available slots immediately.