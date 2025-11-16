# NebulaDB API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "email_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_jwt_token"
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as register

#### POST /auth/refresh
Refresh access token using refresh token.

### User Management

#### GET /user
Get current user information.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": null,
  "email_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /user
Update user information.

### Projects

#### GET /projects
List all projects for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My Project",
    "description": "Project description",
    "owner_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Optional description"
}
```

#### GET /projects/:id
Get specific project details.

#### PUT /projects/:id
Update project information.

#### DELETE /projects/:id
Delete a project and all associated resources.

### Databases

#### GET /projects/:projectId/databases
List all databases in a project.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "production_db",
    "project_id": "uuid",
    "storage_size_gb": 10,
    "max_connections": 100,
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /projects/:projectId/databases
Create a new database.

**Request Body:**
```json
{
  "name": "my_database",
  "storage_size_gb": 5
}
```

#### GET /databases/:id
Get database details and connection information.

#### PUT /databases/:id
Update database configuration.

#### DELETE /databases/:id
Delete a database (irreversible).

### Tables

#### GET /databases/:databaseId/tables
List all tables in a database.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "users",
    "schema_name": "public",
    "columns": {
      "id": {"type": "uuid", "primary_key": true},
      "email": {"type": "varchar", "unique": true},
      "name": {"type": "varchar"}
    },
    "indexes": [
      {"name": "idx_users_email", "columns": ["email"]}
    ],
    "api_enabled": true
  }
]
```

#### POST /databases/:databaseId/tables
Create a new table.

**Request Body:**
```json
{
  "name": "products",
  "columns": {
    "id": {"type": "uuid", "primary_key": true, "default": "gen_random_uuid()"},
    "name": {"type": "varchar", "not_null": true},
    "price": {"type": "decimal", "precision": 10, "scale": 2},
    "created_at": {"type": "timestamp", "default": "NOW()"}
  }
}
```

#### GET /databases/:databaseId/tables/:name
Get table schema and metadata.

#### PUT /databases/:databaseId/tables/:name
Update table schema (add/modify columns).

#### DELETE /databases/:databaseId/tables/:name
Drop a table.

### Auto-Generated APIs

#### GET /databases/:databaseId/api/endpoints
List all auto-generated API endpoints for database tables.

**Response:**
```json
[
  {
    "id": "uuid",
    "table_id": "uuid",
    "method": "GET",
    "path": "/api/data/users",
    "permissions": {"read": ["authenticated"]},
    "rate_limit": 1000,
    "enabled": true
  }
]
```

#### POST /databases/:databaseId/api/endpoints
Create custom API endpoint.

### Usage & Billing

#### GET /projects/:projectId/usage
Get usage statistics for a project.

**Response:**
```json
{
  "current_period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "compute_seconds": 1250.5,
  "storage_gb_hours": 720.0,
  "api_calls": 15000,
  "estimated_cost": 25.50
}
```

#### GET /projects/:projectId/usage/billing
Get billing information and invoices.

## Auto-Generated Data APIs

For each table with `api_enabled: true`, the following endpoints are automatically created:

### GET /api/data/:table_name
List records with optional filtering, sorting, and pagination.

**Query Parameters:**
- `filter`: JSON filter object
- `sort`: Sort field and direction
- `limit`: Number of records (max 100)
- `offset`: Pagination offset

**Example:**
```
GET /api/data/users?filter={"status":"active"}&sort=created_at:desc&limit=10
```

### POST /api/data/:table_name
Create a new record.

### GET /api/data/:table_name/:id
Get a specific record by ID.

### PUT /api/data/:table_name/:id
Update a specific record.

### DELETE /api/data/:table_name/:id
Delete a specific record.

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Rate Limited
- `500`: Internal Server Error