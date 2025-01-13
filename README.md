# NestJS API with TypeORM and PostgreSQL

A RESTful API built with NestJS, TypeORM, and PostgreSQL, implementing user management with pagination and search functionality.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)

## 🛠️ Installation & Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory (use `.env.example` as a template):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=your_database_name
```

## 🏃‍♂️ Running the Application

### Using Docker (Recommended)

Start the application and database with Docker Compose:

```bash
docker-compose up
```

The API will be available at: `http://localhost:3000`

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

## 🎯 Design Considerations

#### Service Version Entity

- Currently the entity exists in the same place as the Service, this is due to them being closely related and didn't need separate endpoints for this entity.

#### Security & Authorization

- Could implement role-based access control using Auth0 roles

#### Error Handling & Logging

- Current implementation uses console.log for error logging
- Could be improved with:
  - Structured logging using Winston
  - Error tracking service integration
  - Detailed error logs with request context
  - Custom error handling service

#### Data Management

- Soft delete functionality could be added to entities for better data tracking
- Would allow for:
  - Record recovery
  - Audit trailing
  - Maintaining referential integrity

## ⚙️ Configuration

The application can be configured using environment variables. See `.env.example` for available options.

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3000/api-docs`
