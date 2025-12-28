import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import {
  PrismaClient,
  event_images,
  events,
} from "../../generated/prisma/client";
import { dbLogger } from "../utils/logger";

// Re-export types for convenience
export type { event_images, events };

// Create a singleton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Get DATABASE_URL - Railway requires SSL but with self-signed cert
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Don't add sslmode if already present
// Railway uses self-signed certs, so we need no-verify
let finalUrl = connectionString;
if (!connectionString.includes("sslmode=")) {
  // Use no-verify for Railway's self-signed certificate
  finalUrl = connectionString + "?sslmode=no-verify";
}

const adapter = new PrismaPg({ connectionString: finalUrl });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Log in development
if (process.env.NODE_ENV !== "production") {
  dbLogger.info("Prisma Client initialized with pg adapter");
}

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
