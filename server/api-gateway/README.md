# OkButFirstCoffee API Gateway

This is the API Gateway for OkButFirstCoffee microservices.

## Overview

The API Gateway serves as a single entry point for all client applications, routing requests to the appropriate microservices:

- Product Service: For coffee products
- Merchandise Service: For merchandise products
- Authentication Service: For user authentication and authorization

## Features

- Unified API access point
- Request routing
- Authentication and authorization
- Rate limiting
- Circuit breaking
- Response caching
- Logging and monitoring

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the API Gateway directory
cd api-gateway

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### Running the Gateway

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Running with Docker

```bash
docker build -t okbutfirstcoffee-api-gateway .
docker run -p 3001:3001 -d okbutfirstcoffee-api-gateway
```

## Configuration

The API Gateway is configured through environment variables or the `.env` file:

```
PORT=3001
NODE_ENV=development
PRODUCT_SERVICE_URL=http://localhost:5002
MERCH_SERVICE_URL=http://localhost:5003
AUTH_SERVICE_URL=http://localhost:5001
...
```

## API Routes

| Route                | Method | Description                       | Authentication Required |
|----------------------|--------|-----------------------------------|-------------------------|
| /api/products        | GET    | Get all products                  | No                      |
| /api/products/:id    | GET    | Get product by ID                 | No                      |
| /api/products        | POST   | Create new product                | Yes (Admin)             |
| /api/products/:id    | PUT    | Update product                    | Yes (Admin)             |
| /api/products/:id    | DELETE | Delete product                    | Yes (Admin)             |
| /api/merch           | GET    | Get all merchandise               | No                      |
| /api/merch/:id       | GET    | Get merchandise by ID             | No                      |
| /api/merch           | POST   | Create new merchandise            | Yes (Admin)             |
| /api/merch/:id       | PUT    | Update merchandise                | Yes (Admin)             |
| /api/merch/:id       | DELETE | Delete merchandise                | Yes (Admin)             |
| /api/auth            | GET    | Get auth status                   | No                      |
| /api/auth/register   | POST   | Register new user                 | No                      |
| /api/auth/login      | POST   | Login user                        | No                      |
| /api/auth/logout     | POST   | Logout user                       | Yes                     |
| /health              | GET    | Gateway health check              | No                      |

## Development

### Project Structure

```
api-gateway/
├── node_modules/
├── src/
│   ├── config/          # Configuration parameters
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── proxy/           # Proxy and client implementations
│   └── server.js        # Main server file
├── protos/              # Protocol buffer definitions
├── logs/                # Log files
├── .env                 # Environment variables
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
