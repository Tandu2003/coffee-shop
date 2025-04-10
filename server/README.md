# OkButFirstCoffee API Gateway Documentation

This documentation provides information about the API Gateway setup for the OkButFirstCoffee microservices architecture.

## Overview

Our application uses an API Gateway pattern to route requests to appropriate microservices. The gateway provides a single entry point for all clients while handling cross-cutting concerns like authentication, rate limiting, and request routing.

## Services

The following microservices are accessible through the API Gateway:

1. [Product Service](./product-service.md) - Manages coffee products
2. [Merch Service](./merch-service.md) - Manages merchandise products
3. [Auth Service](./auth-service.md) - Handles user authentication

## Architecture Diagram

```
                   ┌─────────────────┐
                   │                 │
  Clients ─────────►   API Gateway   │
                   │    (port 3001)  │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
    ┌─────────▼────┐ ┌──────▼───────┐ ┌───▼──────────┐
    │  Product     │ │  Merch       │ │  Auth        │
    │  Service     │ │  Service     │ │  Service     │
    │  (port 5002) │ │  (port 5003) │ │  (port 5001) │
    └──────────────┘ └──────────────┘ └──────────────┘
```

## API Gateway Setup

See [API Gateway Setup](./api-gateway-setup.md) for details on how to configure and deploy the gateway.

## Using the API

Each service documentation provides specific instructions for accessing that service through the API Gateway:

- REST API endpoints
- gRPC endpoints
- Request/response formats
- Authentication requirements

## Common Headers

All requests to the API Gateway should include these common headers:

| Header          | Description                               | Required |
|-----------------|-------------------------------------------|----------|
| Authorization   | Bearer token for authenticated endpoints   | For protected routes |
| Content-Type    | application/json for REST API calls       | Yes      |
| Accept-Language | Preferred language (en-US, es, etc.)      | No       |
