# Setup and Installation

This guide provides instructions on how to set up and run the ServiceHub project using Docker Compose.

## Prerequisites

Ensure you have the following installed on your system:

*   **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
*   **Docker Compose**: Included with Docker Desktop or installed separately.

## Environment Setup

1.  **Navigate to the project root directory.**

2.  **Create the Docker environment file.**
    Copy the example environment file to create your local configuration:
    ```bash
    cp .env.docker.example .env.docker
    ```

3.  **Configure Environment Variables.**
    Open `.env.docker` and review the settings. The default values are generally sufficient for a local development environment, but you should review security-sensitive keys like `JWT_SECRET_KEY` and database passwords if deploying to a shared environment.

    *   **Database Credentials**: Ensure `DB_PASSWORD` matches the password in the connection string.
    *   **OAuth**: If using Google Login, populate `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## Running the Application

To build and start the application containers, run the following command in your terminal:

```bash
docker-compose --env-file .env.docker up --build
```

*   `--env-file .env.docker`: Specifies the environment file to use.
*   `up`: Creates and starts containers.
*   `--build`: Forces a rebuild of the images to ensure the latest code changes are applied.

## Accessing the Application

Once the containers are running and healthy:

*   **Frontend (Web App)**: [http://localhost:4321](http://localhost:4321)
*   **Backend (API)**: [http://localhost:5097](http://localhost:5097)
*   **API Health Check**: [http://localhost:5097/health](http://localhost:5097/health)

## Stopping the Application

To stop the containers and remove the networks:

```bash
docker-compose down
```
