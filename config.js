import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 4000;

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

export const frontendUrls = [
  "https://www.lunevia.in/",
  "https://lunevia.vercel.app/",
  "http://localhost:3000",
]