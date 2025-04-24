FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and add helmet
RUN npm ci --only=production && npm install --no-save helmet

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose ports for REST and gRPC
EXPOSE 5001
EXPOSE 50053

# Start the service
CMD ["node", "server.js"]
