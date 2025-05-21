# Coffee Shop Client (OkButFirstCoffee)

## System Description

This is the frontend (client-side) application for the "OkButFirstCoffee" project. It provides the user interface for customers to browse products (coffee and merchandise), manage their cart, place orders, and interact with customer support (potentially via a chatbot).

## Key Features

- **Product Browsing**: Displays coffee and merchandise items with details and images.
- **Shopping Cart**: Allows users to add/remove items and manage quantities.
- **User Authentication**: Handles user login and registration (interfacing with `auth-service`).
- **Order Placement**: Facilitates the checkout process (interfacing with `order-service`).
- **Real-time Chat**: Integrates a chatbot for customer service (interfacing with `chatbot-service` via `socket.io-client`).
- **Responsive Design**: Adapts to different screen sizes for a good user experience on desktop and mobile devices.

## Libraries Used (from `package.json`)

- **`react`**: The core JavaScript library for building the user interface.
- **`react-dom`**: Provides DOM-specific methods for React.
- **`react-router-dom`**: Handles client-side routing and navigation between different pages/views.
- **`axios`**: A promise-based HTTP client for making API requests to the backend (API Gateway).
- **`sass`**: A CSS preprocessor for writing more maintainable and organized styles.
- **`socket.io-client`**: Enables real-time, bidirectional communication with the `chatbot-service`.
- **`framer-motion`**: A library for creating fluid animations.
- **`swiper`**: Used for creating touch-enabled sliders/carousels (e.g., for product showcases).
- **`@testing-library/react`**: Utilities for testing React components.
- **`cloudinary-react`**: Likely used for displaying images optimized and served by Cloudinary.

## Project Structure (`src/` directory)

- **`Assets/`**: Stores static assets like images (`img/`) and SVG icons (`svg/`).
- **`Components/`**: Reusable UI components (e.g., `Header`, `Footer`, `Card`, `ChatBot`).
- **`Context/`**: React Context API for global state management (e.g., user authentication state, cart state).
- **`Pages/`**: Top-level components representing different views/pages of the application (e.g., HomePage, ProductPage, CartPage).
- **`routes/`**: Defines the application's routing configuration.
- **`utils/`**: Utility functions and helpers.
- **`App.jsx`**: The main application component that sets up routing and global layout.
- **`index.js`**: The entry point of the React application.

## Deployment

- A `Dockerfile` is present, indicating that the client application is designed to be deployed as a Docker container.
- The `package.json` includes standard React scripts:
    - `start`: Runs the app in development mode.
    - `build`: Bundles the app for production.
    - `test`: Runs tests.
    - `eject`: Ejects from Create React App configuration (if used).
- It is typically served as static files by a web server (like Nginx or a Node.js server) or hosted on a static site hosting platform.

## System Architecture

- **Single-Page Application (SPA)**: Built with React, providing a dynamic and interactive user experience without full page reloads.
- **API Communication**: Interacts exclusively with the `api-gateway` for all backend operations. It does not directly communicate with individual microservices.
- **State Management**: Likely uses React Context or a dedicated state management library (like Redux, though not explicitly listed) to manage application state.
- **Real-time Features**: Uses Socket.IO for features like the chatbot.
