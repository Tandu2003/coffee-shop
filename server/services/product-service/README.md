# Product Service (OkButFirstCoffee)

## System Description

This microservice is responsible for managing all coffee-specific products for the "OkButFirstCoffee" application. It handles the catalog of coffee beans, ground coffee, coffee pods, etc., including their details, pricing, and inventory. It is distinct from the `merch-service` which handles non-coffee merchandise.

## Key Responsibilities

- **Coffee Catalog Management**: Provides APIs to list all coffee products, filter by attributes (e.g., bean type, roast level, origin), and search.
- **Product Details**: Exposes endpoints to get detailed information for a specific coffee product (description, images, price, SKU, weight, grind options, stock levels).
- **Inventory Management**: Tracks stock levels for each coffee product. This might involve variations (e.g., different bag sizes or grinds of the same bean).
- **CRUD Operations**: Allows administrators to add new coffee products, update existing item details, and remove items from the catalog.
- **Categorization/Taxonomy**: Manages coffee categories, types, origins, roast levels, etc.

## Libraries Used (Assumed based on common practices for a Node.js service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\product-service\package.json` would confirm these.*

- **`express`**: Web framework for building the service's API endpoints.
- **Database Driver/Client**: (e.g., `pg` for PostgreSQL, `mongodb` for MongoDB) for interacting with the product database.
- **ORM/Query Builder (Optional)**: (e.g., `sequelize`, `typeorm`, `knex.js`) to simplify database interactions.
- **`@grpc/grpc-js` & `@grpc/proto-loader` (If using gRPC)**: If the service communicates with the API Gateway or other services via gRPC.
- **`dotenv`**: For managing environment variables.
- **Validation Library (e.g., `joi`, `express-validator`)**: For validating incoming request data for creating/updating products.
- **Cloud Storage SDK (Optional, e.g., `aws-sdk` for S3, `@google-cloud/storage`)**: If product images are stored in a cloud bucket.

## API Endpoints (Conceptual - exposed via API Gateway)

- `GET /products`: Retrieves a list of all coffee products (can include filtering/pagination parameters like `?type=arabica&roast=medium`).
- `GET /products/{productId}`: Retrieves details for a specific coffee product.
- `POST /products`: (Admin) Adds a new coffee product. Request body includes details like name, description, price, images, stock, attributes (origin, roast, etc.).
- `PUT /products/{productId}`: (Admin) Updates an existing coffee product.
- `DELETE /products/{productId}`: (Admin) Deletes a coffee product.
- `GET /products/attributes`: (Optional) Retrieves available filter attributes like coffee types, roast levels, origins.

## Project Structure (Conceptual)

```
product-service/
├── src/
│   ├── controllers/    # Request handlers for API endpoints
│   ├── services/       # Business logic (product management, inventory)
│   ├── models/         # Database models/schemas for products, attributes
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
- Requires a database to store coffee product information (details, inventory, attributes, images if not using external storage).
- Configuration (database credentials, cloud storage keys if any) is managed via environment variables.

## System Architecture

- **Independent Microservice**: Manages its own data and logic related to coffee products, separate from merchandise or orders.
- **Database Interaction**: Connects to a database to persist and manage the coffee product catalog and inventory.
- **Communication**: Primarily interacts with the **API Gateway**, which routes client requests for coffee products to this service. It will also be queried by the `cart-service` and `order-service` to get product details and update inventory.
- **Image Handling (Potential)**: May involve storing image URLs or integrating with an image hosting/CDN service for product photos.

## Environment Variables (Key Examples)

- `PORT`: Port the service listens on.
- `DATABASE_URL` or individual DB connection params.
- `IMAGE_STORAGE_BASE_URL` (if images are self-hosted or on a specific CDN).
- `CLOUD_STORAGE_BUCKET_NAME`, `CLOUD_STORAGE_CREDENTIALS` (if using cloud storage for images).
