# Merch Service (OkButFirstCoffee)

## System Description

This microservice is responsible for managing all merchandise (non-coffee products) for the "OkButFirstCoffee" application. This includes items like mugs, apparel, brewing equipment, etc. It handles creating, retrieving, updating, and deleting (CRUD) merchandise information, including details, pricing, and inventory.

## Key Responsibilities

- **Merchandise Catalog Management**: Provides APIs to list all merchandise, filter by category, and search.
- **Product Details**: Exposes endpoints to get detailed information for a specific merchandise item (description, images, price, SKU, stock levels).
- **Inventory Management**: Tracks stock levels for each merchandise item. This might involve simple stock counts or more complex inventory logic.
- **CRUD Operations**: Allows administrators to add new merchandise, update existing item details, and remove items from the catalog.

## Libraries Used (Assumed based on common practices for a Node.js service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\merch-service\package.json` would confirm these.*

- **`express`**: Web framework for building the service's API endpoints.
- **Database Driver/Client**: (e.g., `pg` for PostgreSQL, `mongodb` for MongoDB) for interacting with the merchandise database.
- **ORM/Query Builder (Optional)**: (e.g., `sequelize`, `typeorm`, `knex.js`) to simplify database interactions.
- **`@grpc/grpc-js` & `@grpc/proto-loader` (If using gRPC)**: If the service communicates with the API Gateway or other services via gRPC.
- **`dotenv`**: For managing environment variables.
- **Validation Library (e.g., `joi`, `express-validator`)**: For validating incoming request data for creating/updating merchandise.
- **Cloud Storage SDK (Optional, e.g., `aws-sdk` for S3, `@google-cloud/storage`)**: If merchandise images are stored in a cloud bucket.

## API Endpoints (Conceptual - exposed via API Gateway)

- `GET /merch`: Retrieves a list of all merchandise items (can include filtering/pagination parameters).
- `GET /merch/{merchId}`: Retrieves details for a specific merchandise item.
- `POST /merch`: (Admin) Adds a new merchandise item. Request body includes details like name, description, price, images, stock.
- `PUT /merch/{merchId}`: (Admin) Updates an existing merchandise item.
- `DELETE /merch/{merchId}`: (Admin) Deletes a merchandise item.
- `GET /merch/categories`: (Optional) Retrieves a list of merchandise categories.

## Project Structure (Conceptual)

```
merch-service/
├── src/
│   ├── controllers/    # Request handlers for API endpoints
│   ├── services/       # Business logic (merchandise management, inventory)
│   ├── models/         # Database models/schemas for merchandise
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
- Requires a database to store merchandise information (product details, inventory, images if not using external storage).
- Configuration (database credentials, cloud storage keys if any) is managed via environment variables.

## System Architecture

- **Independent Microservice**: Manages its own data and logic related to merchandise, separate from coffee products or orders.
- **Database Interaction**: Connects to a database to persist and manage the merchandise catalog and inventory.
- **Communication**: Primarily interacts with the **API Gateway**, which routes client requests for merchandise to this service. It might also be queried by the `cart-service` or `order-service` to get merchandise details during cart processing or order fulfillment.
- **Image Handling (Potential)**: May involve storing image URLs or integrating with an image hosting/CDN service for merchandise photos.

## Environment Variables (Key Examples)

- `PORT`: Port the service listens on.
- `DATABASE_URL` or individual DB connection params.
- `IMAGE_STORAGE_BASE_URL` (if images are self-hosted or on a specific CDN).
- `CLOUD_STORAGE_BUCKET_NAME`, `CLOUD_STORAGE_CREDENTIALS` (if using cloud storage for images).
