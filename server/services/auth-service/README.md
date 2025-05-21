# Auth Service (OkButFirstCoffee)

## System Description

This microservice is dedicated to managing all aspects of user authentication and authorization within the "OkButFirstCoffee" application. It handles user registration, login, token generation, token validation, and potentially password management functionalities like resets.

## Key Responsibilities

- **User Registration**: Creates new user accounts, typically involving email/username and password.
- **User Login**: Authenticates users based on their credentials and issues access tokens (e.g., JWT).
- **Token Issuance & Validation**: Generates secure tokens upon successful login and provides an endpoint for other services (via the API Gateway) to validate tokens.
- **Password Hashing**: Securely stores user passwords by hashing them (e.g., using bcrypt or Argon2).
- **User Profile Management (Basic)**: May handle basic user profile data directly related to authentication.
- **Role Management (Potential)**: Could be responsible for assigning and managing user roles if role-based access control (RBAC) is implemented.

## Libraries Used (Assumed based on common practices for a Node.js auth service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\auth-service\package.json` would confirm these.*

- **`express`**: Web framework for building the service's API endpoints.
- **`jsonwebtoken`**: For creating and verifying JSON Web Tokens (JWTs).
- **`bcrypt` or `argon2`**: For securely hashing user passwords.
- **Database Driver**: (e.g., `pg` for PostgreSQL, `mysql2` for MySQL, or `mongodb` for MongoDB) for interacting with the user database.
- **ORM/Query Builder (Optional)**: (e.g., `sequelize`, `typeorm`, `knex.js`) to simplify database interactions.
- **`@grpc/grpc-js` & `@grpc/proto-loader` (If using gRPC)**: If the service communicates with the API Gateway or other services via gRPC. The presence of a `protos/` directory within this service or the API Gateway would indicate this.
- **`dotenv`**: For managing environment variables.
- **Validation Library (e.g., `joi`, `express-validator`)**: For validating incoming request data (e.g., email format, password strength).

## API Endpoints (Conceptual - exposed via API Gateway)

- `POST /auth/register`: Registers a new user.
- `POST /auth/login`: Logs in an existing user and returns a token.
- `POST /auth/logout`: (If session/token invalidation is handled server-side) Invalidates a user's session/token.
- `GET /auth/me` or `POST /auth/validate`: Validates a token and returns user information.
- `POST /auth/refresh-token`: (If refresh tokens are used) Issues a new access token using a refresh token.
- `POST /auth/forgot-password`: Initiates a password reset process.
- `POST /auth/reset-password`: Completes the password reset process.

## Project Structure (Conceptual)

```
auth-service/
├── src/
│   ├── controllers/    # Request handlers for API endpoints
│   ├── services/       # Business logic (e.g., user creation, token generation)
│   ├── models/         # Database models/schemas (if using an ORM)
│   ├── routes/         # Route definitions for Express
│   ├── middleware/     # Custom middleware (e.g., error handling)
│   ├── config/         # Configuration (database, JWT secrets)
│   ├── utils/          # Utility functions (e.g., password hashing helpers)
│   └── server.js       # Main server setup file
├── Dockerfile
├── package.json
├── .env.example        # Example environment variables
└── README.md
```

## Deployment

- A `Dockerfile` is present, indicating the service is designed for Docker containerization.
- The `package.json` (expected to be present) would contain `start` and `dev` scripts for running the service.
- It requires a database to store user information.
- Configuration (database credentials, JWT secret, etc.) is managed via environment variables.

## System Architecture

- **Independent Microservice**: Operates as a standalone service focused solely on authentication and authorization.
- **Database Interaction**: Connects to a dedicated user database (or a shared one, depending on the overall architecture) to store and retrieve user credentials and related data.
- **Communication**: Primarily communicates with the **API Gateway**. The API Gateway forwards authentication-related requests from clients to this service and receives responses (e.g., tokens, user data, error messages).
- **Security**: Critical for overall application security. Must implement best practices for password storage, token handling, and protection against common authentication vulnerabilities.

## Environment Variables (Key Examples)

- `PORT`: Port the service listens on.
- `DATABASE_URL` or individual DB connection params (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: Expiration time for access tokens.
- `REFRESH_TOKEN_SECRET` (if using refresh tokens).
- `REFRESH_TOKEN_EXPIRES_IN` (if using refresh tokens).
- `PASSWORD_SALT_ROUNDS` (for bcrypt).
