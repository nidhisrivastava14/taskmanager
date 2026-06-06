# Taskly Backend - Express REST API

This directory contains the REST API for Taskly, built with Node.js, Express.js, MongoDB (via Mongoose), and Zod.

## Core Features
1. **Validation Checks**: Every single request body is validated with **Zod schemas** before database interaction.
2. **JWT Security**: Protected paths use a signature-validation middleware to parse token cookies/headers.
3. **Structured Errors**: Exceptions are routed through a global error parser, mapping MongoDB violations (unique indexes, bad object IDs) to standard response bodies.
4. **Environment Profiles**: Configuration keys load from environment variables (PORT, DB connection strings, JWT keys).

---

## Directory Structure

```
backend/
├── config/
│   └── db.js            # Mongoose connection initialization
├── controllers/         # Endpoints business logic handlers
│   ├── authController.js# User registration & JWT generation
│   └── taskController.js# Tasks CRUD + filtering rules
├── middleware/          # Express route interceptors
│   ├── auth.js          # Extracts bearer headers & injects req.userId
│   └── errorHandler.js  # Catches and normalizes exceptions
├── models/              # MongoDB Schemas
│   ├── User.js          # Password hashing hooks & user schema
│   └── Task.js          # Tasks metadata & index mappings
├── routes/              # Express Router mappings
│   ├── auth.js          # Auth routing tree
│   └── tasks.js         # Tasks routing tree
├── utils/               # Utilities
│   ├── appError.js      # Custom error class for API exceptions
│   └── logger.js        # Timestamped development logs & production JSON logs
├── .env.example         # System variables keys template
├── server.js            # App entrypoint
└── package.json         # Dependency configuration
```

---

## Middlewares Stack

Requests flow through these middleware layers:

```
Incoming Request
  │
  ├── Request logger (development environment only)
  ├── Route parsing (/api/auth or /api/tasks)
  │
  ├── JWT Auth Middleware (Applied to all /api/tasks routes)
  │     ├── Checks Authorization header for Bearer prefix
  │     ├── Decodes token using JWT_SECRET
  │     └── Injects userId into request object (req.userId)
  │
  ├── Controller (Runs Zod schemas and DB calls)
  │
  └── Centralized Error Handler (Catches all exceptions)
        ├── Formats error payloads to standard JSON format
        └── Logs error trace using Logger utility
```

---

## API Endpoints and Payloads

All error or success responses use the same response format:
```json
{
  "success": true, // or false
  "data": { ... },  // contains resources or null on error
  "error": null,   // contains string detail on error
  "code": "SUCCESS_CODE" // status code (e.g. TASK_CREATED, UNAUTHORIZED)
}
```

### 1. Authentication (`/api/auth`)
#### Register
- **Endpoint**: `POST /api/auth/register`
- **Body Requirement (Zod Schema)**:
  ```json
  {
    "name": "Full Name (max 50 chars)",
    "email": "valid-email@domain.com",
    "password": "Password string (min 6 chars)",
    "confirmPassword": "Must match password"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "665f80b182fb5a0e980313c0",
        "name": "Full Name",
        "email": "valid-email@domain.com"
      }
    },
    "code": "REGISTER_SUCCESS"
  }
  ```

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Body Requirement (Zod Schema)**:
  ```json
  {
    "email": "valid-email@domain.com",
    "password": "Password string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "665f80b182fb5a0e980313c0",
        "name": "Full Name",
        "email": "valid-email@domain.com"
      }
    },
    "code": "LOGIN_SUCCESS"
  }
  ```

---

### 2. Task Management (`/api/tasks`)
*All task routes require the header `Authorization: Bearer <token>`.*

#### Fetch Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status` (`pending` | `completed`) - Filter by status
  - `priority` (`low` | `medium` | `high`) - Filter by priority level
  - `startDate` (ISO Date string) - Filter tasks with due dates starting from this date
  - `endDate` (ISO Date string) - Filter tasks with due dates up to this date
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "665f82c482fb5a0e980313c8",
        "title": "Review specs",
        "description": "Double check all MERN guidelines",
        "status": "pending",
        "priority": "high",
        "dueDate": "2026-06-05T00:00:00.000Z",
        "userId": "665f80b182fb5a0e980313c0",
        "createdAt": "2026-06-04T12:00:00.000Z",
        "updatedAt": "2026-06-04T12:00:00.000Z"
      }
    ],
    "code": "FETCH_TASKS_SUCCESS"
  }
  ```

#### Create Task
- **Endpoint**: `POST /api/tasks`
- **Body Requirement (Zod Schema)**:
  ```json
  {
    "title": "Task title (3 to 100 chars, required)",
    "description": "Task description string (optional)",
    "priority": "low | medium | high (optional, default: medium)",
    "dueDate": "ISO Date string (optional)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "665f82c482fb5a0e980313c8",
      "title": "Review specs",
      ...
    },
    "code": "TASK_CREATED"
  }
  ```

#### Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Body Requirement (Zod Schema)**: Any combination of title, description, status, priority, and dueDate.
- **Success Response (200 OK)**: Returns the updated task object.

#### Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": null,
    "code": "TASK_DELETED"
  }
  ```
