# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
COPY backend/package*.json ./backend/

# Set npm config for better network resilience
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retries 5

# Install dependencies with a retry mechanism
RUN npm install --no-audit || (sleep 5 && npm install --no-audit) || (sleep 10 && npm install --no-audit)

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files and package files
COPY --from=build /app/dist ./dist
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 