# Movie Management Service

## Overview

The Movie Management Service is a microservice designed to manage movies, user tickets, and watch history. The overall architecture of the system ensures scalability and flexibility. The service specifically focuses on managing movie data, user tickets, and watch history.

## Features

- User Management: Manage users and their movie tickets.
- Movie Management: Create, update, and delete movies.
- Ticket Management: Manage user tickets for movies.
- Watch History: Track and manage user watch history.
- API Documentation: Swagger integration for API documentation.

## Technologies Used

- TypeScript: For type-safe JavaScript.
- NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.
- MongoDB: NoSQL database for storing user, movie, and ticket data.
- Redis: In-memory data structure store for caching.
- Swagger: API documentation.

## Getting Started

### Prerequisites

- Node.js: v14.x or later
- npm: v6.x or later
- MongoDB: v4.x or later
- Redis: v5.x or later
- Docker & Docker Compose: Latest version

### Installation

1. Clone the repository:
    ```sh
    git clone git@github.com:buketozdemir/movie-management.git
    cd movie-management
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
    ```env
    NODE_ENV=development
    PORT=3000
    MONGODB_URI=mongodb://mongo:27017/movie-management
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_USERNAME=redis
    REDIS_PASSWORD=redis
    ```

### Running the Application

#### Running with Node.js
1. Start the application:
    ```sh
    npm run start
    ```

2. Access the API documentation:
   Open your browser and navigate to `http://localhost:3000/documentation`.

#### Running with Docker

1. Start the application using Docker Compose:
    ```sh
    docker-compose up -d
    ```

2. Check running containers:
    ```sh
    docker ps
    ```

3. Stop the application:
    ```sh
    docker-compose down
    ```

### Running Tests

For testing, MongoMemoryServer and ioredis-mock have been used to create a more realistic simulation of the environment. This allows for seamless in-memory testing of MongoDB and Redis operations, ensuring that the service performs correctly in various scenarios.

To run the tests, use the following command:
```sh
npm run test
