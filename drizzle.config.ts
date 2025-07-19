// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config(); // Load env vars

export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql", // ✅ needed for Supabase/PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ works for Supabase
  },
} satisfies Config;
