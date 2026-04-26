# NoSQL Lab Productivity Hub

A boilerplate Express + MongoDB (Mongoose) REST API for NoSQL lab exercises. Manage tasks with full CRUD, filtering, and tagging support.

## Features

- **Express** web server
- **MongoDB** via **Mongoose** ODM
- Full **CRUD** for Tasks
- Query filtering by `completed`, `priority`, and `tag`
- In-memory MongoDB for tests (no external DB required)

## Project Structure

```
src/
├── app.js                 # Express app entry point
├── config/
│   └── database.js        # Mongoose connection helpers
├── controllers/
│   └── taskController.js  # Route handler logic
├── models/
│   └── Task.js            # Mongoose Task schema
└── routes/
    ├── index.js           # /api/health
    └── tasks.js           # /api/tasks CRUD routes
tests/
└── tasks.test.js          # Jest + Supertest integration tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
cp .env.example .env   # edit MONGODB_URI as needed
```

### Running

```bash
npm start        # production
npm run dev      # development (nodemon watch)
```

### Testing

```bash
npm test
```

## API Reference

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/health       | Health check         |
| GET    | /api/tasks        | List all tasks       |
| POST   | /api/tasks        | Create a task        |
| GET    | /api/tasks/:id    | Get task by ID       |
| PUT    | /api/tasks/:id    | Update task by ID    |
| DELETE | /api/tasks/:id    | Delete task by ID    |

### Query Parameters for `GET /api/tasks`

| Param       | Type    | Description                         |
|-------------|---------|-------------------------------------|
| `completed` | boolean | Filter by completion status         |
| `priority`  | string  | Filter by priority (low/medium/high)|
| `tag`       | string  | Filter by a specific tag            |

### Task Schema

```json
{
  "title":       "string (required)",
  "description": "string",
  "completed":   "boolean (default: false)",
  "priority":    "low | medium | high (default: medium)",
  "tags":        ["string"]
}
```