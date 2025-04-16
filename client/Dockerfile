# Stage 1: Build the React app
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Create .env file with correct environment variables
RUN echo "REACT_APP_URL_FONTEND=http://localhost:3000" > .env && \
    echo "REACT_APP_API_AUTH=http://localhost:5001" >> .env && \
    echo "REACT_APP_API_PRODUCT=http://localhost:5002" >> .env && \
    echo "REACT_APP_API_MERCH=http://localhost:5003" >> .env

# Build the React application
RUN npm run build

# Stage 2: Create a production environment
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
