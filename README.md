# Mock E-Commerce API

This project is a mock e-commerce API built with **Node.js** and **Express.js**, simulating CRUD operations for users and products. It uses separate CSV files to store data and includes caching and header validation for improved performance and security.

---

## Features

1. **CRUD Operations**:
   - Create, Read, Update, and Delete (CRUD) endpoints for `users` and `products`.
   
2. **CSV File Storage**:
   - Data for users and products is stored in separate CSV files (`users.csv` and `products.csv`).

3. **Caching**:
   - GET requests are cached for 60 seconds using `node-cache`.
   - Cache invalidates automatically upon data modification.

4. **Headers Validation**:
   - Requires `Content-Type: application/json` for data operations.
   - Requires `Authorization: Bearer mock-token` for write operations (POST, PUT, DELETE).
---

## Requirements

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Dependencies

The following dependencies are used:

- `express`: Web framework for creating API endpoints.
- `body-parser`: Middleware to parse JSON requests.
- `csv-parse` and `csv-stringify`: To read and write CSV files.
- `node-cache`: Simple in-memory caching.

---

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Server**:
   ```bash
   node server.js
   ```

   The server will start at `http://localhost:3000`.

---

## API Endpoints

### Users

| Method | Endpoint        | Description                |
|--------|-----------------|----------------------------|
| GET    | `/users`        | Fetch all users            |
| POST   | `/users`        | Create a new user          |
| PUT    | `/users/:id`    | Update an existing user    |
| DELETE | `/users/:id`    | Delete a user              |

### Products

| Method | Endpoint        | Description                |
|--------|-----------------|----------------------------|
| GET    | `/products`     | Fetch all products         |
| POST   | `/products`     | Create a new product       |
| PUT    | `/products/:id` | Update an existing product |
| DELETE | `/products/:id` | Delete a product           |

---

## Testing

### Using REST Client

1. Install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
2. Create a `test.http` file in your project with the following content:

   ```http
   ### Fetch all users
   GET http://localhost:3000/users

   ### Add a new user
   POST http://localhost:3000/users
   Content-Type: application/json
   Authorization: Bearer mock-token

   {
       "name": "Albert Hammond Jr",
       "email": "albert@thestrokes.com"
   }
   ```

3. Open the `test.http` file in VS Code and click "Send Request" to test endpoints.

### Verify Caching

1. Send a `GET /users` request and note the response time.
2. Send the same request again; it should be faster (served from cache).
3. Add, update, or delete a user, then resend `GET /users` to verify cache invalidation.

### Test Headers Validation

1. Remove `Authorization` or `Content-Type` header in any write operation (`POST`, `PUT`, `DELETE`).
2. The server will return appropriate error responses:
   - Missing `Content-Type` → **400 Bad Request**
   - Missing `Authorization` → **401 Unauthorized**





