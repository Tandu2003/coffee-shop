# OkButFirstCoffee API Gateway

## System Description

This is the API Gateway for the "OkButFirstCoffee" microservices-based application. It serves as the single entry point for all incoming requests from client applications (e.g., the React frontend). Its primary responsibilities include request routing, authentication, rate limiting, and providing a unified interface to the various backend microservices.

## Key Responsibilities & Features

- **Request Routing**: Directs incoming HTTP requests to the appropriate downstream microservice (e.g., `product-service`, `auth-service`) based on the request path or other criteria.
- **Authentication & Authorization**: Verifies user credentials (e.g., JWT tokens) for protected routes and ensures users have the necessary permissions before forwarding requests to microservices. It communicates with the `auth-service` for these tasks.
- **Rate Limiting**: Protects backend services from overload by limiting the number of requests a client can make in a given time period (using `express-rate-limit`).
- **Circuit Breaking**: Implements a circuit breaker pattern (using `opossum`) to prevent cascading failures. If a microservice becomes unresponsive, the gateway can temporarily stop sending requests to it and return a fallback response.
- **Service Discovery (Implicit)**: Knows the addresses of the backend microservices (configured via environment variables).
- **Protocol Translation (Potential)**: While primarily HTTP, it uses gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) to communicate with backend services that might expose gRPC interfaces. The `protos/` directory likely contains the protocol buffer definitions for this communication.
- **Logging & Monitoring**: Centralized logging of requests and responses (using `morgan` and `winston`).
- **Security**: Implements basic security measures using `helmet` and `cors`.
- **Response Caching**: Uses `memory-cache` for caching responses from services to improve performance and reduce load on backend services.

## Libraries Used (from `package.json`)

- **`express`**: A minimal and flexible Node.js web application framework, used as the foundation for the gateway.
- **`http-proxy-middleware`**: Used to proxy HTTP requests to other servers (the microservices).
- **`@grpc/grpc-js` & `@grpc/proto-loader`**: Libraries for making gRPC calls to backend microservices that use gRPC.
- **`jsonwebtoken`**: For handling JSON Web Tokens (JWTs) for authentication.
- **`cookie-parser`**: Middleware to parse `Cookie` header and populate `req.cookies`.
- **`cors`**: Middleware for enabling Cross-Origin Resource Sharing.
- **`dotenv`**: Loads environment variables from a `.env` file.
- **`express-rate-limit`**: Middleware for rate limiting incoming requests.
- **`helmet`**: Helps secure Express apps by setting various HTTP headers.
- **`memory-cache`**: A simple in-memory cache.
- **`morgan`**: HTTP request logger middleware.
- **`opossum`**: A circuit breaker for Node.js, helps in building resilient applications.
- **`winston`**: A versatile logging library.

## Project Structure (`src/` directory)

- **`config/`**: Likely contains configuration files or modules (e.g., for Winston logger, CORS options).
- **`middleware/`**: Custom Express middleware (e.g., authentication checks, error handling).
- **`routes/`**: Defines the API routes that the gateway exposes and maps them to proxy configurations or gRPC calls.
- **`proxy/`**: May contain specific logic for proxying requests or gRPC client implementations.
- **`server.js`**: The main entry point that sets up the Express server, middleware, and routes.
- **`protos/`**: Contains `.proto` files defining the service contracts for gRPC communication with backend microservices.

## Deployment

- A `Dockerfile` is present, indicating the service is intended for Docker-based deployment.
- `package.json` scripts:
    - `start`: Runs the server in production mode (using `node src/server.js`).
    - `dev`: Runs the server in development mode with `nodemon` for auto-restarts.
    - `test`: Runs tests (using `jest`).
- Configuration is managed via environment variables (e.g., `PORT`, service URLs like `PRODUCT_SERVICE_URL`), loaded from a `.env` file in development.

## System Architecture

- **Central Entry Point**: All external traffic to the OkButFirstCoffee backend flows through this gateway.
- **Decoupling**: Decouples clients from the internal microservice architecture. Clients only need to know the gateway's address.
- **Cross-Cutting Concerns**: Handles common concerns like authentication, logging, and rate limiting in a centralized manner.
- **Communication Protocols**: Handles HTTP from clients and can communicate with backend services using HTTP or gRPC.

## API Routes

| Route                | Method | Description                       | Authentication Required |
|----------------------|--------|-----------------------------------|-------------------------|
| `/api/products`        | GET    | Get all products                  | No                      |
| `/api/products/:id`    | GET    | Get product by ID                 | No                      |
| `/api/products`        | POST   | Create new product                | Yes (Admin)             |
| `/api/products/:id`    | PUT    | Update product                    | Yes (Admin)             |
| `/api/products/:id`    | DELETE | Delete product                    | Yes (Admin)             |
| `/api/merch`           | GET    | Get all merchandise               | No                      |
| `/api/merch/:id`       | GET    | Get merchandise by ID             | No                      |
| `/api/merch`           | POST   | Create new merchandise            | Yes (Admin)             |
| `/api/merch/:id`       | PUT    | Update merchandise                | Yes (Admin)             |
| `/api/merch/:id`       | DELETE | Delete merchandise                | Yes (Admin)             |
| `/api/auth`            | GET    | Get auth status                   | No                      |
| `/api/auth/register`   | POST   | Register new user                 | No                      |
| `/api/auth/login`      | POST   | Login user                        | No                      |
| `/api/auth/logout`     | POST   | Logout user                       | Yes                     |
| `/health`              | GET    | Gateway health check              | No                      |

## Environment Variables (Key Examples)

- `PORT`: Port the API Gateway listens on.
- `NODE_ENV`: Environment (development, production).
- `JWT_SECRET`: Secret key for signing and verifying JWTs.
- `AUTH_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `ORDER_SERVICE_URL`, etc.: URLs/addresses of the downstream microservices.
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`: Configuration for rate limiting.

(This section should be expanded based on actual usage in `.env.example` or configuration files.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
