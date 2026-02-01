# Fitness App

A full-stack web application for fitness tracking and coaching, featuring a modern React frontend and a robust NestJS backend. This application now includes AI-powered coaching and workout analysis.

## Project Structure

- `/src`: React frontend (Vite, Tailwind CSS, shadcn/ui, Material UI)
- `/server`: NestJS backend (MongoDB, OpenAI integration)

## Features

- **Personalized AI Coach**: Chat interface powered by OpenAI to get fitness advice and answers.
- **Workout Summaries**: AI-generated summaries of your workout sessions.
- **Social Feed**: Share posts, like, and comment on other users' activities.
- **User Profiles**: Manage your profile and view others.
- **Authentication**: Secure login and registration with JWT.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- **MongoDB**: You need a running MongoDB instance (local or cloud like MongoDB Atlas).
- **OpenAI API Key**: Required for AI features.

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

3. **Environment Configuration**:
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/fitness-app
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_key
   ```
   *Note: Adjust `MONGO_URI` if you are using a remote database.*

4. **Seed Initial Data**:
   Populate the database with initial user data:
   ```sh
   npm run seed-user
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
- `npm run seed-user`: Run the database seeding script.

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
- **Database**: MongoDB with Mongoose
- **AI Integration**: OpenAI API
- **Authentication**: Passport.js, JWT

## Deployment

The application is designed to be deployed as a single unit or separately. The `npm start` command in the root directory builds both parts and runs the server, which is configured to serve the static client files.
