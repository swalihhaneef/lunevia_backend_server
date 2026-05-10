import { config } from "dotenv";
import fs from "fs";

export const PORT = process.env.PORT || 4000;

if (!fs.existsSync(".env") && !fs.existsSync(".env.development")) {
  throw new Error("Missing both .env and .env.local files. At least one is required.");
}

const env = fs.existsSync(".env.development") ? ".env.development" : ".env";

config({ path: env });

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}
