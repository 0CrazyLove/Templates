# ServiceHub - Project Overview

## Introduction
ServiceHub is a modern, scalable web application designed to facilitate service management and user interaction. It leverages a robust microservices-ready architecture with a .NET Core backend and a high-performance Astro frontend.

## Live Demo
You can view the live application deployed on Render here: [ServiceHub Live Demo](https://servicehub-esd7.onrender.com/)

## Architecture

The project follows a decoupled client-server architecture, containerized using Docker for consistent deployment across environments.

### Technology Stack

*   **Backend**: ASP.NET Core Web API (.NET 8/9)
    *   Provides RESTful endpoints for the frontend.
    *   Handles business logic, authentication, and data persistence.
    *   Uses Entity Framework Core for ORM.
*   **Frontend**: Astro (Node.js)
    *   Delivers a fast, server-side rendered (SSR) user interface.
    *   Styled with TailwindCSS for a modern, responsive design.
    *   Consumes the backend API for dynamic content.
*   **Database**: PostgreSQL 16
    *   Relational database management system for persistent storage.
    *   Running in a Docker container.
*   **Containerization**: Docker & Docker Compose
    *   Orchestrates the multi-container application (Backend, Frontend, Database).

## Key Features

*   **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and Google OAuth integration.
*   **Service Management**: Comprehensive CRUD operations for managing services.
*   **Responsive UI**: A mobile-first, responsive user interface built with modern web standards.
*   **Scalability**: Designed with separation of concerns to allow independent scaling of frontend and backend components.
