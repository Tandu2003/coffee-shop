# Chatbot Service (OkButFirstCoffee)

## System Description

This microservice powers the real-time chatbot functionality for the "OkButFirstCoffee" application. It enables customers to interact with an automated assistant for queries, support, or guidance. The client application (`coffee-shop/client`) uses `socket.io-client` to connect to this service.

## Key Responsibilities

- **Real-time Communication**: Establishes and manages WebSocket connections with clients (via Socket.IO).
- **Message Handling**: Receives messages from users and sends responses back.
- **Natural Language Processing (NLP)**: Processes user input to understand intent. This might involve:
    - Using a cloud-based NLP service (e.g., Dialogflow, Amazon Lex, Microsoft LUIS).
    - Employing local NLP libraries (e.g., `natural`, `compromise`).
- **Dialog Management**: Maintains the context of the conversation and determines appropriate responses or actions.
- **Integration with Other Services (Potential)**: May need to communicate with other microservices (e.g., `order-service` to check order status, `product-service` for product information) via the API Gateway or direct gRPC calls to fulfill user requests.
- **Predefined Flows/Scripts**: Handles common questions and scenarios with scripted responses.

## Libraries Used (Assumed based on common practices for a Node.js chatbot service)

*Since `package.json` for this specific service is not directly provided, these are typical libraries. The actual `package.json` in `c:\Users\PC\Workspace\Project\OkButFirstCoffee\coffee-shop\server\services\chatbot-service\package.json` would confirm these.*

- **`socket.io`**: Enables real-time, bidirectional event-based communication between the client and the server.
- **`express` (Optional)**: Might be used if the service also needs to expose HTTP endpoints for configuration or health checks, though primary communication is via WebSockets.
- **NLP Library/SDK**: (e.g., `dialogflow`, `@google-cloud/dialogflow`, `aws-sdk` for Lex, or open-source libraries like `natural`, `rasa` (if a more complex setup)).
- **`dotenv`**: For managing environment variables (e.g., API keys for NLP services).
- **Logging Library (e.g., `winston`)**: For logging chat interactions and service events.

## Communication Protocol

- **Primary**: WebSocket (Socket.IO) for real-time chat between client and server.
- **Secondary (Potential)**: HTTP/REST or gRPC for internal communication with other microservices if needed to fetch data or trigger actions.

## Project Structure (Conceptual)

```
chatbot-service/
├── src/
│   ├── handlers/         # Socket.IO event handlers (on connection, on message)
│   ├── nlp/              # NLP processing logic, intent recognition
│   ├── dialogs/          # Conversation flow definitions
│   ├── services/         # Logic for interacting with other microservices
│   ├── config/           # Configuration (NLP service keys, etc.)
│   └── server.js         # Main server setup (Socket.IO, possibly Express)
├── package.json
├── .env.example
└── README.md
```

## Deployment

- While no `Dockerfile` is explicitly listed in the provided high-level structure for *this specific service*, it's expected to be containerized for consistency with other services in the microservice architecture. A `Dockerfile` would typically be present.
- The `package.json` (expected) would contain `start` and `dev` scripts.
- May require API keys or credentials for external NLP services, managed via environment variables.

## System Architecture

- **Stateful Connections**: Maintains active WebSocket connections with clients during a chat session.
- **Event-Driven**: Reacts to incoming messages and other events over the WebSocket connection.
- **NLP Core**: The brain of the chatbot, responsible for understanding and responding to users.
- **Service Integration**: Acts as an orchestrator for certain user requests that require information from other parts of the system.

## Environment Variables (Key Examples)

- `PORT`: Port the service (especially if an HTTP server is also running) listens on.
- `NLP_SERVICE_API_KEY` (or similar, depending on the provider).
- `NLP_PROJECT_ID` (e.g., for Dialogflow).
- URLs for other services if direct communication is used (e.g., `ORDER_SERVICE_GRPC_TARGET`).
