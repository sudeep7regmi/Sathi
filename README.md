# Sathi — Real-Time Futsal Coordination & Management Platform

A full-stack web application for coordinating futsal in Pokhara, Nepal. Three roles —
**Player**, **Futsal Owner**, and **Admin** — each with their own web dashboard, plus
real-time match chat and live scores over WebSockets.

---  overall structure

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + Vite, React Router, Tailwind CSS, Axios, socket.io-client |
| Backend    | Node.js + Express (ES modules) |
| Database   | **MySQL** via Sequelize ORM |
| Real-time  | Socket.io (match chat + live score) |
| Auth       | JWT (Bearer tokens) + bcrypt password hashing, role-based access control |

```
sathi-platform/
├── backend/      Express REST API + Socket.io + Sequelize models  (port 5000)
└── frontend/     React + Vite single-page web app                 (port 5173)
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8 (or MariaDB) running locally

Create an empty database once:

```sql
CREATE DATABASE sathi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 1) Backend setup

```bash
cd backend
npm install
cp .env.example .env          # then edit DB_USER / DB_PASS to match your MySQL
npm run seed                  # creates tables + loads Pokhara/NPR demo data
npm run dev                   # starts API on http://localhost:5000
```

`.env` keys:

```
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sathi
DB_USER=root
DB_PASS=
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
```

The server auto-creates/syncs tables on boot. `npm run seed` resets and re-populates them.

## 2) Frontend setup

```bash
cd frontend
npm install
npm run dev                   # opens http://localhost:5173
```

Vite proxies `/api` and `/socket.io` to the backend on port 5000 (see `vite.config.js`),
so no extra config is needed in development.

---

## Demo accounts (password: `password123`)

| Role   | Email                       | What you can do |
|--------|-----------------------------|-----------------|
| Player | `aarav.sharma@gmail.com`    | Discover & join matches, create matches, approve join requests, book courts, live score + scorer, real-time chat, notifications |
| Owner  | `owner@lakeside.np`         | Dashboard, approve/decline bookings, manage venues & courts |
| Admin  | `admin@sathi.com`           | Platform overview, manage users, verify futsal venues |

Log out from the sidebar to switch roles.

---

## Feature → role map

- **Auth & roles** — register/login, JWT sessions, role-based routing & API guards
- **Matchmaking** — browse/filter matches, request to join, host approves/declines
- **Match management** — create matches, squads, capacity, approval mode
- **Booking** — players book court slots; owners confirm/decline; double-booking prevented
- **Live score** — host opens *Scorer mode*; goals & status broadcast live to all viewers
- **Real-time chat** — per-match group chat over Socket.io
- **Notifications** — join requests, approvals, bookings, verifications
- **Owner tools** — venue registration (→ admin verification), bookings, courts
- **Admin** — platform stats, user management (suspend/activate), venue verification

---

## REST API reference (base `/api`)

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| GET  | `/auth/me` | authed |
| PUT  | `/auth/me` | authed |

### Matches
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/matches` (`?skill=&format=&status=`) | public |
| GET | `/matches/:id` | public |
| POST | `/matches` | authed |
| POST | `/matches/:id/join` | authed |
| GET | `/matches/:id/requests` | host |
| PATCH | `/matches/:id/requests/:userId` | host |
| PATCH | `/matches/:id/score` | host/admin |
| POST | `/matches/:id/events` | host/admin |

### Futsals / Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/futsals` (`?verified=true&mine=true`) | public/authed |
| POST | `/futsals` | owner/admin |
| PUT | `/futsals/:id` | owner/admin |
| GET | `/bookings` | authed (scoped by role) |
| POST | `/bookings` | authed |
| PATCH | `/bookings/:id` | owner/admin |

### Chat / Notifications / Tournaments / Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET/POST | `/chat/:thread` | authed |
| GET | `/notifications`, PATCH `/notifications/:id/read`, `/notifications/read-all` | authed |
| GET | `/tournaments`, `/tournaments/:id`; POST `/tournaments` | public / owner-admin |
| GET | `/admin/stats`, `/admin/users`, `/admin/verifications` | admin |
| PATCH | `/admin/users/:id`, `/admin/verifications/:id` | admin |

### Socket.io events
- `room:join` / `room:leave` — join a `match:<id>` room
- `chat:send` → server persists → broadcasts `chat:message`
- `score:update` / `score:event` — emitted to a match room when the scorer updates

---

# Production notes

- Replace `sequelize.sync({ alter: true })` with proper **migrations** (`sequelize-cli`).
- Set a strong `JWT_SECRET` and serve over HTTPS.
- Build the frontend with `npm run build` (outputs `frontend/dist/`) and serve it behind
  the API or any static host; point it at the API origin.

---

© 2026 Sathi · Pokhara, Nepal
