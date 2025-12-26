# Backend Dockerfile for Railway (Bun + SQLite)
# Use Debian-based image instead of Alpine for better native module compatibility
FROM oven/bun:1

WORKDIR /app

# Install dependencies for better-sqlite3 native builds
# apt-get is available in oven/bun:1 (Debian)
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

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
# Default port if not provided by Railway
ENV PORT=3001 

# Expose port (Railway will use PORT env var, but EXPOSE is good practice)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3001}/ || exit 1

# Start the server
CMD ["bun", "run", "api/index.ts"]
