import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config( { path: "./.env.development.local" } );

export default defineConfig({
  schema: "./db/migrations/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});