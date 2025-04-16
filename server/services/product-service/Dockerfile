FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose ports for REST and gRPC
EXPOSE 5002
EXPOSE 50051

# Start the service
CMD ["node", "server.js"]
