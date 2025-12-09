# Configuration Guide

This document details the configuration options available for the ServiceHub application, primarily managed through environment variables in the `.env.docker` file.

## Environment Variables

The application uses a centralized configuration approach. Below are the key variables found in `.env.docker`.

### Database Configuration

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DB_SERVER` | Hostname of the database container. | `database` |
| `DB_PORT` | Port exposed by the SQL Server container. | `1433` |
| `DB_NAME` | Name of the application database. | `AppDB` |
| `DB_USER` | Database username (typically `sa` for SQL Server). | `sa` |
| `DB_PASSWORD` | Database password. **Change this in production.** | `CHANGE_ME...` |
| `MSSQL_PID` | SQL Server edition. | `Express` |
| `CONNECTION_STRING` | Full ADO.NET connection string used by the backend. | `Server=database...` |

### Authentication (JWT)

| Variable | Description |
| :--- | :--- |
| `JWT_SECRET_KEY` | The secret key used to sign and verify JWT tokens. Must be a long, random string. |
| `JWT_ISSUER` | The `iss` claim in the JWT, identifying the issuer. |
| `JWT_AUDIENCE` | The `aud` claim in the JWT, identifying the intended recipient. |
| `JWT_EXPIRATION_MINUTES` | Token validity duration in minutes. |

### Google OAuth

To enable Google Sign-In, you must configure a project in the [Google Cloud Console](https://console.cloud.google.com/).

| Variable | Description |
| :--- | :--- |
| `GOOGLE_CLIENT_ID` | The Client ID provided by Google. |
| `GOOGLE_CLIENT_SECRET` | The Client Secret provided by Google. |
| `GOOGLE_REDIRECT_URI` | The callback URL authorized in Google Console. |

### Application Ports

| Variable | Description | Default |
| :--- | :--- | :--- |
| `BACKEND_PORT` | Port mapped to the host for the Backend API. | `5097` |
| `FRONTEND_PORT` | Port mapped to the host for the Frontend application. | `4321` |

## Docker Compose Configuration

The `docker-compose.yml` file defines the services and their relationships.

*   **Services**:
    *   `database`: SQL Server container.
    *   `backend`: Builds from `./Backend/Dockerfile.backend`. Depends on `database`.
    *   `frontend`: Builds from `./Frontend/Dockerfile.frontend`. Depends on `backend`.
*   **Networks**: All services communicate over a custom bridge network `servicehub_network`.
*   **Volumes**: `sqlserver_data` persists database data locally.
