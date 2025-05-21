# Cart Service (OkButFirstCoffee)

## System Description

This microservice is responsible for managing user shopping carts in the "OkButFirstCoffee" application. It allows users to add products and merchandise to their cart, update quantities, remove items, and view the current state of their cart before proceeding to checkout.

## Key Responsibilities

- **Add Item to Cart**: Allows adding a specified product/merchandise item and quantity to a user's cart.
- **Remove Item from Cart**: Allows removing an item from the cart.
- **Update Item Quantity**: Allows changing the quantity of an item already in the cart.
- **Get Cart Contents**: Retrieves all items currently in a user's cart, including product details (potentially by referencing product/merch services or storing a snapshot) and total price.
- **Clear Cart**: Empties all items from a user's cart (e.g., after an order is placed or on user request).
- **Cart Persistence**: Manages how carts are stored – whether associated with a logged-in user (persistent) or a session for guest users.

## Libraries Used (Assumed based on common practices for a Node.js service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\cart-service\package.json` would confirm these.*

- **`express`**: Web framework for building the service's API endpoints.
- **Database Driver/Client**: (e.g., `pg` for PostgreSQL, `mongodb` for MongoDB, or a client for a key-value store like Redis if carts are stored there for performance).
- **ORM/Query Builder (Optional)**: (e.g., `sequelize`, `typeorm`, `knex.js`) to simplify database interactions if a relational or document database is used for cart storage.
- **`@grpc/grpc-js` & `@grpc/proto-loader` (If using gRPC)**: If the service communicates with the API Gateway or other services (e.g., to fetch product details) via gRPC.
- **`dotenv`**: For managing environment variables.
- **Validation Library (e.g., `joi`, `express-validator`)**: For validating incoming request data (e.g., product IDs, quantities).

## API Endpoints (Conceptual - exposed via API Gateway)

Let `userId` or `sessionId` be an identifier for the cart.

- `GET /carts/{cartId}`: Retrieves the contents of a specific cart.
- `POST /carts/{cartId}/items`: Adds an item to the cart. Request body might include `productId`, `quantity`.
- `PUT /carts/{cartId}/items/{itemId}`: Updates the quantity of a specific item in the cart. Request body might include `quantity`.
- `DELETE /carts/{cartId}/items/{itemId}`: Removes a specific item from the cart.
- `DELETE /carts/{cartId}`: Clears all items from the cart.

## Project Structure (Conceptual)

```
cart-service/
├── src/
│   ├── controllers/    # Request handlers for API endpoints
│   ├── services/       # Business logic (cart operations)
│   ├── models/         # Database models/schemas for cart data
│   ├── routes/         # Route definitions for Express
│   ├── config/         # Configuration (database connections)
│   └── server.js       # Main server setup file
├── Dockerfile
├── package.json
├── .env.example
└── README.md
```

## Deployment

- A `Dockerfile` is present, indicating the service is designed for Docker containerization.
- The `package.json` (expected) would contain `start` and `dev` scripts.
- Requires a persistent storage solution (e.g., PostgreSQL, MongoDB, Redis) to store cart data, especially for logged-in users.
- Configuration is managed via environment variables.

## System Architecture

- **Independent Microservice**: Manages cart data and logic separately from other concerns like product catalogs or order processing.
- **Data Storage**: Interacts with a database or a cache to store and retrieve cart information. The choice of storage depends on requirements for persistence, performance, and data structure (e.g., Redis for temporary guest carts, a relational DB for persistent user carts).
- **Communication**: Interacts with the **API Gateway**. It might also need to communicate with the `product-service` and `merch-service` to fetch up-to-date product details (like price, availability) when displaying the cart, unless this information is denormalized and stored within the cart itself.
- **User Association**: Carts need to be associated with users (if logged in) or sessions (for guests).

## Environment Variables (Key Examples)

- `PORT`: Port the service listens on.
- `DATABASE_URL` or specific DB/Redis connection parameters.
- `PRODUCT_SERVICE_URL` (if it needs to call the product service directly).
- `MERCH_SERVICE_URL` (if it needs to call the merch service directly).
