# Fitness App

A full-stack web application for fitness tracking, featuring a modern React frontend and a robust NestJS backend.

## Project Structure

- `/src`: React frontend (Vite, Tailwind CSS, shadcn/ui, Material UI)
- `/server`: NestJS backend

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/web-course-colman/fitness-app-web-server.git
   cd fitness-app-web-server
   ```

2. Install dependencies for both client and server:
   ```sh
   npm install
   cd server
   npm install
   cd ..
   ```

## Running the Application

You can run both the frontend and backend concurrently using the root package scripts.

### Development Mode

Run both client and server with auto-reload:
```sh
npm run dev:all
```

- **Frontend**: http://localhost:8080 (or as specified by Vite)
- **Backend**: http://localhost:3002

### Production Mode

Build and start the full-stack application:
```sh
npm start
```

## Available Scripts

### Root Directory
- `npm run dev:all`: Start both client and server in development mode.
- `npm start`: Build both apps and start the production server.
- `npm run dev`: Start only the frontend development server.
- `npm run server:dev`: Start only the backend development server.
- `npm run build`: Build the frontend.
- `npm run server:build`: Build the backend.

### Server Directory
- `npm run start:dev`: Start the NestJS server in watch mode.
- `npm run build`: Build the NestJS application.

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui, Material UI (@mui/material)
- **Icons**: Lucide React, Material UI Icons
- **State Management/Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form, Zod

### Backend
- **Framework**: NestJS
- **Language**: TypeScript

## Deployment

The application is designed to be deployed as a single unit or separately. The `npm start` command in the root directory builds both parts and runs the server, which is configured to serve the static client files.

