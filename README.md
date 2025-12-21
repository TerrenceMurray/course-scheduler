# Course Scheduler

Schedule university courses into rooms with conflict detection.

## About

A web application for scheduling university courses into available rooms while respecting constraints and preventing double-bookings. Built as a proof of concept for managing academic timetables.

## Features

- **Room Management** — Add rooms with type (lab, classroom, lecture hall), building, and capacity
- **Course Management** — Define courses with session types, durations, and weekly frequency
- **Conflict Detection** — Prevents double-booking rooms and validates room type requirements
- **Schedule Views** — View timetables by course, room, or building
- **Data Import** — Bulk import rooms and courses via CSV

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go |
| Database | PostgreSQL |
| Frontend | React + Vite |

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/course-scheduler.git
cd course-scheduler

# Backend
cd backend
cp .env.example .env  # Configure your database URL
go run ./cmd/server

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
course-scheduler/
├── backend/
│   ├── cmd/server/       # Entry point
│   └── internal/
│       ├── models/       # Data models
│       ├── database/     # PostgreSQL operations
│       ├── handlers/     # HTTP handlers
│       └── scheduler/    # Scheduling algorithm
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── views/        # Page views
│       └── api/          # API client
└── README.md
```

## Status

🚧 Work in progress

## License

MIT
