# Backend Dockerfile for Railway (Bun + SQLite)
FROM oven/bun:1-alpine

WORKDIR /app

# Install dependencies for better-sqlite3 native builds
RUN apk add --no-cache python3 make g++ sqlite

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Create data directory for SQLite persistence
RUN mkdir -p /data

# Set environment variables
ENV NODE_ENV=production
ENV DB_PATH=/data/events.db

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Start the server
CMD ["bun", "run", "api/index.ts"]
