# Backend Dockerfile for Railway (Node.js + pnpm)
FROM node:20-slim

WORKDIR /app

# Install pnpm and build dependencies for better-sqlite3
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy package.json (skip lockfile to force fresh install and respect pnpm config)
COPY package.json ./

# Install dependencies
RUN pnpm install

# Force rebuild of better-sqlite3 to ensure bindings exist
RUN pnpm rebuild better-sqlite3

# Copy source files
COPY . .

# Create data directory for SQLite persistence
RUN mkdir -p /data

# Set environment variables
ENV NODE_ENV=production
ENV DB_PATH=/data/events.db
# Default port if not provided by Railway
ENV PORT=3001 

# Expose port
EXPOSE 3001

# Health check (using curl which might not be in slim, install it or use node script)
# Installing curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3001}/scrape/status || exit 1

# Start the server using tsx
CMD ["pnpm", "exec", "tsx", "api/index.ts"]
