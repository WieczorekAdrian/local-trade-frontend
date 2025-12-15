# Local Trade - Frontend Client

This repository contains the client-side application for "Local Trade," a marketplace platform built to demonstrate modern React development practices. The project focuses on clean architecture, type safety, and secure authentication patterns.

## Tech Stack

- **Core:** React (Vite), TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API (Global State)
- **HTTP Client:** Axios (with Interceptors)
- **Routing:** React Router DOM

## Key Features & Architecture

### 1. Secure Authentication Pattern
Unlike standard implementations that rely on storing tokens in `localStorage` (which is vulnerable to XSS attacks), this client is architected to handle authentication via **HttpOnly cookies**.

- The application includes a dedicated `AuthProvider` that automatically verifies user sessions upon initialization using a secure `/auth/me` endpoint.
- Custom hooks (`useAuth`) abstract the complexity of session management from the UI components.

### 2. Clean Architecture & Separation of Concerns
The codebase strictly separates business logic from presentation:

- **Services:** All API communication is centralized in `services/`, keeping components clean.
- **Smart vs. Dumb Components:** Pages handle data fetching and logic, while UI components focus purely on presentation.
- **Custom Hooks:** Reusable logic is encapsulated in custom hooks to maintain DRY (Don't Repeat Yourself) principles.

### 3. Strict Typing
The project utilizes TypeScript to its full potential. API responses and application state are strictly typed to ensure data consistency with the backend and to prevent runtime errors.

### Prerequisites

- Node.js (v18 or higher)
- A running instance of the Backend API

## Author 

Author: Adrian Wieczorek
