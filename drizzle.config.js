import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./utils/schema.jsx", // Path to your schema file
    dialect: "postgresql",        // Database dialect
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL, // Load URL from environment variable
    },
});
