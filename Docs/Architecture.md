
# TripCraft - System Architecture

## 1. Architecture Overview

TripCraft follows a three-tier client-server architecture.

### Presentation Layer
- React
- Vite
- Bootstrap
- React Router
- Axios
- Context API

### Application Layer
- Node.js
- Express.js
- JWT Authentication
- Prisma ORM

### Data Layer
- PostgreSQL Database

## 2. External Services

The backend communicates with external services:

- Google Gemini API: AI itinerary generation and travel assistance.
- OpenTripMap API: Discovering destinations and points of interest.
- OpenStreetMap: Map data.
- Open-Meteo API: Weather information.

## 3. Request Flow

1. The user interacts with the React frontend.
2. Axios sends HTTP requests to the Express backend.
3. Express processes requests and validates data.
4. Prisma communicates with PostgreSQL when database access is required.
5. The backend communicates with external APIs when needed.
6. The backend returns responses to the frontend.
7. React updates the user interface.

## 4. Security

- JWT is used for authentication.
- Passwords are hashed using bcrypt.
- API keys are stored in backend environment variables.
- The frontend never accesses database credentials directly.





## 5. Architecture Diagram

![TripCraft Architecture](./Trip%20Planning%20Data%20Model-2026-11-18-094643.png)