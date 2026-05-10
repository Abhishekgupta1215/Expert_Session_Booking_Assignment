# Real-Time Expert Session Booking System

Full-stack booking system built with React (web), Node.js, Express, MongoDB (Atlas supported), and Socket.io for real-time updates.

## Quick start

1. Copy environment examples and populate secrets:

	- `server/.env` (example in `server/.env.example`) — set `MONGODB_URI`, `PORT`, and `CLIENT_ORIGIN`.
	- `client/.env` (example in `client/.env.example`) — set `VITE_API_URL` and `VITE_SOCKET_URL`.

2. Install dependencies (root workspace):

```bash
npm install
```

3. Run development servers in two terminals:

Backend:
```bash
npm run dev:server
```

Frontend:
```bash
npm run dev:client
```

Open the app at http://localhost:5173

## Environment variables

server/.env (required)

```env
PORT=5000
# Example MongoDB Atlas URI (replace <user>, <password>, and <db>):
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.qiddv8s.mongodb.net/<db>?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

client/.env (required for dev)

```env
# Base API URL (note: includes the /api prefix used by the server)
VITE_API_URL=http://localhost:5000/api
# Socket.io server URL
VITE_SOCKET_URL=http://localhost:5000
```

## API endpoints

- `GET /api/experts` — list experts (supports `search`, `category`, `page`, `limit` query params)
- `GET /api/experts/:id` — expert details (includes availability snapshot)
- `POST /api/bookings` — create booking; payload: `{ expertId, name, email, phone, date, timeSlot, notes }`
- `PATCH /api/bookings/:id/status` — update booking status (`Pending|Confirmed|Completed`)
- `GET /api/bookings?email=` — list bookings for an email

## Real-time events (Socket.io)

- `slot-booked` — emitted when a new booking is created; payload `{ expertId, date, timeSlot }`
- `booking-status-updated` — emitted when a booking status changes; payload `{ bookingId, status }`

## Important details

- Double-booking prevention: the `Booking` model enforces a unique compound index on `(expertId, date, timeSlot)` so concurrent requests cannot create conflicting bookings. The API surfaces a `409`/`11000` duplicate-key error when a slot is already taken.
- Seeding: the server automatically seeds sample experts if the experts collection is empty on startup.

## Build for production

```bash
npm run build
```

This builds the client into `client/dist/` (ready to serve) and keeps the server code in `server/` for deployment.

## Troubleshooting

- If the backend fails to connect to MongoDB, verify `MONGODB_URI` and network access (Atlas IP whitelist or use 0.0.0.0/0 for testing).
- Ensure the client env vars use the `VITE_` prefix so Vite exposes them to the browser.

If you'd like, I can also add a condensed API reference file or open a PR with these changes.