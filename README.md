# Sellpy Web Interview Case

This repository contains my solution to Sellpy's web interview assignment.

The starter project was a small React app with mocked client-side state and a minimal Express backend that did not persist anything. My goal was to solve the main persistence task, complete the bonus tasks, and leave the app in a state that would be easy to explain and extend during the interview.

## Live Deployments

- Frontend: [https://rydholm168.github.io/web-interview/](https://rydholm168.github.io/web-interview/)
- Backend: [https://sellpy-todos-manu.fly.dev/](https://sellpy-todos-manu.fly.dev/)

Deployments are automated through GitHub Actions:

- `frontend/**` changes deploy to GitHub Pages
- `backend/**` changes deploy to Fly.io

## Assignment Coverage

### Main task

- Persist todo lists on the server

Implemented with SQLite instead of in-memory JS objects. Data survives page refreshes, local server restarts, and backend redeploys in production.

### Additional tasks completed

- Autosave when adding or editing items
- Mark a todo item as completed
- Mark a todo list as completed when all items are completed
- Add a completion date and show remaining time / overdue status

## What Changed From The Starter

### Backend

- Replaced the placeholder Express "Hello World" backend with a GraphQL API using Apollo Server
- Added SQLite persistence with `better-sqlite3`
- Added a small migration system that runs SQL files in `backend/migrations/`
- Seeded the database with the two original todo lists from the starter
- Added a Fly.io configuration for production deployment

### Frontend

- Replaced the mocked fetch flow with Apollo Client queries and mutations
- Moved from Create React App to Vite
- Split the todo form into smaller components for rows, save status, and time handling
- Added debounced autosave with inline save feedback
- Added completion checkboxes, due-date inputs, and list-level completion styling
- Updated the UI to feel closer to Sellpy's website instead of a default MUI starter

## Current Feature Set

- View multiple todo lists
- Switch between lists with tab-like navigation
- Add a new todo with the floating action button (or by pressing the Enter key)
- Create an empty todo row immediately and focus it for fast entry
- Edit todo text with debounced autosave
- Delete todo items
- Mark items complete / incomplete
- Automatically mark a list as complete when all of its items are complete
- Set a due date per todo
- Show deadline states: `X days left`, `Due today`, `Overdue by X days`, `Complete`
- Show per-item save feedback: `Saving...`, `Saved`, `Error`

## Architecture Overview

### Frontend

- React 18
- Vite
- MUI
- Apollo Client

The frontend fetches todo lists through GraphQL and mutates individual todos for add, update, and delete operations.

Autosave is handled with a small debouncing hook. Each todo row saves independently, which keeps the UI responsive and makes save state easy to display per item.

### Backend

- Node.js
- Apollo Server
- GraphQL
- SQLite via `better-sqlite3`

The backend exposes:

- `Query.todoLists`
- `Mutation.addTodo`
- `Mutation.updateTodo`
- `Mutation.deleteTodo`

`isComplete` is derived in the resolver layer rather than stored in the database. That keeps the stored model simple and avoids syncing derived state.

## Data Model

### `todo_lists`

- `id`
- `title`
- `created_at`

### `todos`

- `id`
- `list_id`
- `text`
- `completed`
- `due_date`
- `created_at`

Migrations are tracked in a `_migrations` table and applied automatically on startup.

## Persistence Details

### Local development

- Local DB path: `backend/todos.db`
- WAL mode is enabled
- The database file is created automatically on first run
- To reset local data, stop the backend and delete `backend/todos.db` plus any `-wal` / `-shm` sidecar files

### Production

- Fly.io mounts a persistent volume at `/data`
- Production DB path is `/data/todos.db`
- The Fly app keeps one machine running because SQLite is being used as a single-writer database

That setup keeps the solution simple while still giving real persistence in production.

## Deployment Setup

### Frontend

- Hosted on GitHub Pages
- Build uses:
  - `VITE_GRAPHQL_URL=https://sellpy-todos-manu.fly.dev/`
  - `VITE_BASE_PATH=/web-interview/`
- The workflow also copies `index.html` to `404.html` so the SPA works correctly on GitHub Pages

### Backend

- Hosted on Fly.io
- Deploy command: `flyctl deploy --remote-only`
- Triggered automatically on pushes to `master`

## Getting Started

### Prerequisites

- Node.js 20 (`.nvmrc`)

### Backend

Navigate to the backend folder

```bash
npm ci
npm start
```

### Frontend

navigate to the frontend folder

```bash
npm ci
npm start
```
