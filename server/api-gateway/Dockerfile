FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs protos

# Expose ports for REST and gRPC
EXPOSE 3001

# Health check setup
RUN apk --no-cache add curl

# Start the service
CMD ["node", "src/server.js"]