# Order Service (OkButFirstCoffee)

## System Description

This microservice is responsible for managing all aspects of customer orders within the "OkButFirstCoffee" application. This includes order creation, processing, payment integration (conceptual), order history tracking, and status updates.

## Key Responsibilities

- **Order Creation**: Accepts order details (customer information, items from the cart, shipping address, billing information) and creates a new order record.
- **Order Processing**: Manages the lifecycle of an order (e.g., pending, paid, processing, shipped, delivered, cancelled).
- **Payment Integration (Conceptual)**: Would typically integrate with a payment gateway (e.g., Stripe, PayPal) to process payments. This service would handle payment status updates.
- **Order History**: Allows users to retrieve their past orders.
- **Inventory Update (Coordination)**: After an order is placed, it needs to coordinate with `product-service` and `merch-service` to update stock levels.
- **Notification (Conceptual)**: Could trigger notifications to users about order status changes (e.g., via email or an SMS service).

## Libraries Used (Assumed based on common practices for a Node.js service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\order-service\package.json` would confirm these.*

- **`express`**: Web framework for building the service's API endpoints.
- **Database Driver/Client**: (e.g., `pg` for PostgreSQL, `mongodb` for MongoDB) for interacting with the order database.
- **ORM/Query Builder (Optional)**: (e.g., `sequelize`, `typeorm`, `knex.js`) to simplify database interactions.
- **Payment Gateway SDK (e.g., `stripe`, `paypal-rest-sdk`)**: If integrating directly with payment providers.
- **`@grpc/grpc-js` & `@grpc/proto-loader` (If using gRPC)**: For communication with the API Gateway or other services (like product/merch for inventory updates).
- **`axios` or `node-fetch` (If calling other REST services)**: For HTTP communication if gRPC is not used for all inter-service calls.
- **`dotenv`**: For managing environment variables.
- **Validation Library (e.g., `joi`, `express-validator`)**: For validating incoming order data.
- **Messaging Queue Client (Optional, e.g., `amqplib` for RabbitMQ, `kafkajs` for Kafka)**: If using asynchronous communication for order processing steps or notifications.

## API Endpoints (Conceptual - exposed via API Gateway)

- `POST /orders`: Creates a new order. Request body includes cart details, shipping info, etc.
- `GET /orders`: (Admin or User-specific) Retrieves a list of orders.
- `GET /orders/{orderId}`: Retrieves details for a specific order.
- `PUT /orders/{orderId}/status`: (Admin) Updates the status of an order (e.g., to 'shipped').
- `POST /orders/{orderId}/payment`: (Conceptual) Initiates or confirms payment for an order.

## Project Structure (Conceptual)

```
order-service/
├── src/
│   ├── controllers/    # Request handlers for API endpoints
│   ├── services/       # Business logic (order processing, payment integration)
│   ├── models/         # Database models/schemas for orders, order items
│   ├── routes/         # Route definitions for Express
│   ├── integrations/   # Payment gateway integration logic
│   ├── listeners/      # (If using message queues) Event listeners
│   ├── config/         # Configuration (database, payment keys)
│   └── server.js       # Main server setup file
├── Dockerfile          # Expected to be present for containerization
├── package.json
├── .env.example
└── README.md
```

## Deployment

- While no `Dockerfile` is explicitly listed in the provided high-level structure for *this specific service*, it's expected to be containerized. A `Dockerfile` would typically be present.
- The `package.json` (expected) would contain `start` and `dev` scripts.
- Requires a database to store order information.
- Securely manages API keys for payment gateways via environment variables.

## System Architecture

- **Independent Microservice**: Manages order data and processing logic.
- **Database Interaction**: Connects to its own database (or a shared one) to store order details, line items, customer information related to orders, and payment status.
- **Inter-Service Communication**:
    - Receives requests from the **API Gateway**.
    - Communicates with `product-service` and `merch-service` to verify item availability and update inventory after an order is placed (this could be synchronous or asynchronous via a message queue).
    - Communicates with a **Payment Gateway** for payment processing.
    - May publish events to a message queue (e.g., `OrderCreated`, `PaymentSuccessful`) for other services to consume (e.g., a notification service).
- **Transactional Integrity**: Critical to ensure that order creation, payment, and inventory updates are handled reliably, potentially using database transactions or saga patterns in a distributed environment.

## Environment Variables (Key Examples)

- `PORT`: Port the service listens on.
- `DATABASE_URL` or individual DB connection params.
- `PAYMENT_GATEWAY_API_KEY`, `PAYMENT_GATEWAY_SECRET_KEY`.
- `PRODUCT_SERVICE_URL` / `PRODUCT_SERVICE_GRPC_TARGET`.
- `MERCH_SERVICE_URL` / `MERCH_SERVICE_GRPC_TARGET`.
- `RABBITMQ_URL` (if using RabbitMQ).
